import { createBrowserRouter } from "react-router-dom";
import { SearchPage } from "./pages/SearchPage";
import AdPage from "./pages/AdPage";
import StartPage from "./pages/StartPage";
import NotFoundPage from "./pages/NotFoundPage";
import { Layout } from "./pages/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/",
        element: <StartPage />,
      },
      { 
        path: "/search", 
        element: <SearchPage /> 
      },
      { 
        path: "/ad/:id", 
        element: <AdPage /> 
      },
    ]
  }
]);
