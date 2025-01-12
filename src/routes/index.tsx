import { createBrowserRouter } from "react-router-dom";
import { Layout } from "../components/Layout";
import { HomePage } from "../pages/HomePage";
import { ClassicalCiphersPage } from "../pages/ClassicalCiphersPage";
import { ModernEncryptionPage } from "../pages/ModernEncryptionPage";
import { PracticePage } from "../pages/PracticePage";
import ResourcesPage from "../pages/ResourcesPage";
import DataEncryptionStandard from '../pages/DataEncryptionStandard';


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <div>Page Not Found</div>, // Optional error element
    children: [
      { index: true, element: <HomePage /> },
      { path: "classical-ciphers", element: <ClassicalCiphersPage /> },
      { path: "modern-encryption", element: <ModernEncryptionPage /> },
      { path: "practice", element: <PracticePage /> },
      { path: "resources", element: <ResourcesPage /> }, // Consistent path string
      { path: "DataEncryptionStandard", element: <DataEncryptionStandard /> }
    ],
  },
]);
