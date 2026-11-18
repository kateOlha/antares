import { Navigate, useParams } from "react-router-dom";
import { getClient } from "../clients";
import { HomePage } from "./HomePage";

export function ClientPage() {
  const { slug } = useParams();
  const client = getClient(slug);

  if (!client) {
    return <Navigate to="/clients" replace />;
  }

  return (
    <div className={`client-landing template-${client.slug}`}>
      <HomePage
        basePath={`/clients/${client.slug}`}
        pageTitle={`${client.short} · ${client.name}`}
      />
    </div>
  );
}
