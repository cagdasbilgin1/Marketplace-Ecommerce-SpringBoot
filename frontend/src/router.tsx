import { createBrowserRouter } from "react-router-dom";

import { AccountPage } from "./pages/AccountPage";
import { AuthPage } from "./pages/AuthPage";
import { DevSessionPage } from "./pages/DevSessionPage";
import { AppShell } from "./shell/AppShell";
import { CategoryPage } from "./pages/CategoryPage";
import { HomePage } from "./pages/HomePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { NotFoundPage } from "./pages/NotFoundPage";

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
    path: ":sellerSlug/:productKey",
    element: <ProductDetailPage />,
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
]);
