# Scandiweb E-Commerce Frontend

This project is a modern e-commerce storefront built with React, TypeScript, and Vite. It connects to a GraphQL backend to provide a complete shopping experience.

## Features

- **Product Browsing**: Browse products by category (All, Clothes, Tech)
- **Product Details**: View detailed product information with an image gallery
- **Attribute Selection**: Select product attributes (size, color, capacity)
- **Shopping Cart**: Add products to the cart, modify quantities, and manage selections
- **Checkout Process**: Complete purchases with shipping information

## Technology Stack

- **React 19** with TypeScript
- **Apollo Client** for GraphQL data fetching
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **DOMPurify** and **html-react-parser** for safe HTML rendering

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Clone the repository:
  ```bash
  git clone https://github.com/your-repo/scandiweb-project.git
  cd scandiweb-project/frontend
  ```

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create a `.env` file in the root directory with:
  ```env
  VITE_BACKEND_URL=http://your-backend-url/graphql
  ```

### Development

Start the development server:
```bash
npm run dev
```

### Building for Production

Build the project:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

The project follows a modular structure with separate folders for components, pages, and utilities. API requests are handled using Apollo Client, and styles are managed with Tailwind CSS.

## API Integration

The application connects to a GraphQL backend. In development mode, API requests are proxied through `/graphql` to avoid CORS issues. In production, the `VITE_BACKEND_URL` environment variable is used.

## Deployment

This project is deployed on Vercel. For deployment:

1. Ensure proper environment variables are set.
2. Configure the build command as:
  ```bash
  npm run build
  ```
3. Set the output directory to `dist`.

## Original Vite Information

For information about Vite configuration, ESLint setup, and other template-specific details, see the Vite documentation.

---

### Expanding the ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
   ...tseslint.configs.recommendedTypeChecked,
   ...tseslint.configs.strictTypeChecked,
   ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
   parserOptions: {
    project: ["./tsconfig.node.json", "./tsconfig.app.json"],
    tsconfigRootDir: import.meta.dirname,
   },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
   "react-x": reactX,
   "react-dom": reactDom,
  },
  rules: {
   ...reactX.configs["recommended-typescript"].rules,
   ...reactDom.configs.recommended.rules,
  },
});
```
