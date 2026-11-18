import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ClientPage } from "./pages/ClientPage";
import { ClientsPage } from "./pages/ClientsPage";
import { HomePage } from "./pages/HomePage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/:slug" element={<ClientPage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
