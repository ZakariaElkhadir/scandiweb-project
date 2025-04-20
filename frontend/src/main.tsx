import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
const client = new ApolloClient({
  uri: import.meta.env.DEV
    ? "/graphql"
    : `${import.meta.env.VITE_BACKEND_URL}/graphql`,
  cache: new InMemoryCache(),
  credentials: "include", 
});
createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);
