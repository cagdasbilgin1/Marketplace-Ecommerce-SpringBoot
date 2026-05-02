import { createBrowserRouter, useParams } from "react-router-dom";

import { AccountPage } from "./pages/AccountPage";
import { AuthPage } from "./pages/AuthPage";
import { DevSessionPage } from "./pages/DevSessionPage";
import { AppShell } from "./shell/AppShell";
import { CategoryPage } from "./pages/CategoryPage";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { SellerOfficePage } from "./pages/SellerOfficePage";
import { SellerRegistrationPage } from "./pages/SellerRegistrationPage";
import { SellerDashboardPage } from "./pages/SellerDashboardPage";

function DynamicRouteResolver() {
  const { subSlug } = useParams();
  
  if (subSlug && subSlug.includes("-p-")) {
    return <ProductDetailPage />;
  }
  
  return <CategoryPage />;
}

const children = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: "account",
    element: <AccountPage />,
  },
  {
    path: "auth",
    element: <AuthPage />,
  },
  {
    path: ":slug",
    element: <CategoryPage />,
  },
  ...(import.meta.env.DEV
    ? [
        {
          path: "dev/session",
          element: <DevSessionPage />,
        },
      ]
    : []),
  {
    path: ":slug/:subSlug",
    element: <DynamicRouteResolver />,
  },
  {
    path: ":slug/:subSlug/:subSubSlug",
    element: <CategoryPage />,
  },
  {
    path: "products/:slug",
    element: <ProductDetailPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children,
  },
  {
    path: "/so",
    element: <SellerOfficePage />,
  },
  {
    path: "/so/register",
    element: <SellerRegistrationPage />,
  },
  {
    path: "/so/dashboard",
    element: <SellerDashboardPage />,
  },
]);
