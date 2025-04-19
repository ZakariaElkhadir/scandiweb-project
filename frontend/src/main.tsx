import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from "@apollo/client";
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_BACKEND_URL 
    ? `${import.meta.env.VITE_BACKEND_URL}/graphql` 
    : "/graphql",
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <StrictMode>
      <App />
    </StrictMode>
  </ApolloProvider>
);
