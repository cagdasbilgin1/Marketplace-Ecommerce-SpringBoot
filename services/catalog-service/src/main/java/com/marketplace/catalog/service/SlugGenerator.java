package com.marketplace.catalog.service;

import java.text.Normalizer;
import java.util.Locale;

import org.springframework.stereotype.Component;

@Component
public class SlugGenerator {

    public String generate(String value) {
        if (value == null || value.isBlank()) {
            return "item";
        }

        String ascii = value
                .replace('ç', 'c')
                .replace('Ç', 'c')
                .replace('ğ', 'g')
                .replace('Ğ', 'g')
                .replace('ı', 'i')
                .replace('İ', 'i')
                .replace('ö', 'o')
                .replace('Ö', 'o')
                .replace('ş', 's')
                .replace('Ş', 's')
                .replace('ü', 'u')
                .replace('Ü', 'u');

        String normalized = Normalizer.normalize(ascii, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");

        return normalized.isBlank() ? "item" : normalized;
    }
}
