import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
const apiUrl = import.meta.env.PROD
  ? `${import.meta.env.VITE_BACKEND_URL}/graphql`
  : "/graphql";

console.log("Using GraphQL endpoint:", apiUrl);
const client = new ApolloClient({
  uri: apiUrl,
  cache: new InMemoryCache(),
  credentials: "include",
});
createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>,
);
