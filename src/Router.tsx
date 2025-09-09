import { createBrowserRouter } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import AdPage from "./pages/AdPage";
import StartPage from "./pages/StartPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <StartPage />,
    errorElement: <NotFoundPage />,
  },
  { path: "/search", element: <SearchPage /> },
  { path: "/ad/:id", element: <AdPage /> },
]);
