#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SEED_FILE="${SEED_FILE:-$ROOT_DIR/seed/catalog-seed.json}"
API_BASE_URL="${API_BASE_URL:-http://localhost:8080/api/catalog}"
AUTH_BASE_URL="${AUTH_BASE_URL:-http://localhost:8080/api/auth}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_command curl
require_command jq

if [[ ! -f "$SEED_FILE" ]]; then
  echo "Seed file not found: $SEED_FILE" >&2
  exit 1
fi

AUTH_TOKEN="${AUTH_TOKEN:-}"
AUTH_USERNAME="${AUTH_USERNAME:-}"
AUTH_PASSWORD="${AUTH_PASSWORD:-}"

if [[ -z "$AUTH_TOKEN" && -n "$AUTH_USERNAME" && -n "$AUTH_PASSWORD" ]]; then
  echo "Access token aliniyor..."
  login_response="$(curl -fsS -X POST "$AUTH_BASE_URL/login" \
    -H 'Content-Type: application/json' \
    -d "{\"username\":\"$AUTH_USERNAME\",\"password\":\"$AUTH_PASSWORD\"}")"
  AUTH_TOKEN="$(printf '%s' "$login_response" | jq -r '.access_token')"
fi

if [[ -z "$AUTH_TOKEN" ]]; then
  echo "AUTH_TOKEN eksik. Alternatif olarak AUTH_USERNAME ve AUTH_PASSWORD verebilirsin." >&2
  exit 1
fi

auth_header=(-H "Authorization: Bearer $AUTH_TOKEN" -H 'Content-Type: application/json')
tmp_categories="$(mktemp)"
trap 'rm -f "$tmp_categories"' EXIT

refresh_categories() {
  curl -fsS "$API_BASE_URL/categories" > "$tmp_categories"
}

category_id_by_slug() {
  local slug="$1"
  jq -r --arg slug "$slug" '.[] | select(.slug == $slug) | .id' "$tmp_categories"
}

product_exists() {
  local slug="$1"
  local status
  status="$(curl -s -o /dev/null -w '%{http_code}' "$API_BASE_URL/products/by-slug/$slug")"
  [[ "$status" == "200" ]]
}

refresh_categories

echo "Kategoriler import ediliyor..."
while IFS= read -r category; do
  slug="$(printf '%s' "$category" | jq -r '.slug')"
  name="$(printf '%s' "$category" | jq -r '.name')"
  existing_id="$(category_id_by_slug "$slug")"

  if [[ -n "$existing_id" ]]; then
    echo "  - atlandi: $name ($slug)"
    continue
  fi

  payload="$(printf '%s' "$category" | jq '{name, slug}')"
  created="$(curl -fsS -X POST "$API_BASE_URL/categories" "${auth_header[@]}" -d "$payload")"
  created_id="$(printf '%s' "$created" | jq -r '.id')"
  echo "  - olusturuldu: $name ($created_id)"
  refresh_categories
done < <(jq -c '.categories[]' "$SEED_FILE")

seller_id="$(jq -r '.sellerId' "$SEED_FILE")"
seller_slug="$(jq -r '.sellerSlug // empty' "$SEED_FILE")"
seller_name="$(jq -r '.sellerName // empty' "$SEED_FILE")"

echo "Urunler import ediliyor..."
while IFS= read -r product; do
  slug="$(printf '%s' "$product" | jq -r '.slug')"
  name="$(printf '%s' "$product" | jq -r '.name')"
  category_slug="$(printf '%s' "$product" | jq -r '.categorySlug')"
  category_id="$(category_id_by_slug "$category_slug")"

  if [[ -z "$category_id" ]]; then
    echo "  - hata: kategori bulunamadi -> $category_slug" >&2
    exit 1
  fi

  if product_exists "$slug"; then
    echo "  - atlandi: $name ($slug)"
    continue
  fi

  payload="$(printf '%s' "$product" | jq \
    --arg sellerId "$seller_id" \
    --arg categoryId "$category_id" \
    --arg sellerSlug "$seller_slug" \
    --arg sellerName "$seller_name" \
    'del(.categorySlug)
      | .metadata = ((.metadata // {})
        + (if $sellerSlug != "" then {sellerSlug: $sellerSlug} else {} end)
        + (if $sellerName != "" then {sellerName: $sellerName} else {} end))
      | . + {sellerId: $sellerId, categoryId: $categoryId}')"

  created="$(curl -fsS -X POST "$API_BASE_URL/products" "${auth_header[@]}" -d "$payload")"
  created_id="$(printf '%s' "$created" | jq -r '.id')"
  echo "  - olusturuldu: $name ($created_id)"
done < <(jq -c '.products[]' "$SEED_FILE")

echo
echo "Import tamamlandi."
echo "Kategori sayisi: $(jq 'length' "$tmp_categories")"
