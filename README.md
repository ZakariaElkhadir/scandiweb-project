# Scandiweb Frontend Test Project

This project is a React + TypeScript application built with Vite. It includes features such as category-based product filtering, product details, and a cart system (currently under development). The project uses Apollo Client for GraphQL queries and TailwindCSS for styling.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Backend Setup](#backend-setup)
- [Available Scripts](#available-scripts)
- [Development Notes](#development-notes)
- [Expanding the ESLint Configuration](#expanding-the-eslint-configuration)
- [Future Improvements](#future-improvements)

---

## Features

- **Category-based Product Filtering**: Browse products by categories such as "All", "Clothes", and "Tech".
- **Product Details Page**: View detailed information about a product, including images, price, and attributes like size and color.
- **Cart System (WIP)**: Add products to the cart and view them in a dropdown cart component.
- **GraphQL Integration**: Fetch data from a GraphQL API using Apollo Client.
- **Responsive Design**: Built with TailwindCSS for a responsive and modern UI.

---

## Project Structure

```
frontend/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── README.md
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── vite.svg
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    ├── vite-env.d.ts
    ├── assets/
    │   └── logo.png
    └── Components/
        ├── Cart.tsx
        ├── Header.tsx
        └── Products/
            ├── productDetails.tsx
            ├── productPage.tsx
            ├── ProductsProp.tsx
            └── ProductsSection.tsx
```

---

## Setup and Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/scandiweb-project.git
   cd scandiweb-project/frontend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Open the app in your browser at [http://localhost:5173](http://localhost:5173).

5. To build the project for production:
   ```sh
   npm run build
   ```

6. Preview the production build:
   ```sh
   npm run preview
   ```

---

## Backend Setup

The backend is required to serve the GraphQL API that this frontend consumes. Below is a placeholder for the backend structure and setup instructions. Replace this section with the actual backend details.

### Backend Structure

```
backend/
├── .env
├── package.json
├── server.js
├── src/
│   ├── resolvers/
│   ├── schemas/
│   └── models/
└── ...
```

### Running the Backend

1. Navigate to the backend directory:
   ```sh
   cd ../backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the backend server:
   ```sh
   npm run start
   ```

4. The backend server should run on [http://localhost:8000](http://localhost:8000) by default.

---

## Available Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the project for production.
- `npm run preview`: Previews the production build.
- `npm run lint`: Runs ESLint to check for code quality issues.

---

## Development Notes

### GraphQL API
The project uses Apollo Client to fetch data from a GraphQL API. The API endpoint is proxied through Vite's development server configuration in [`vite.config.ts`](vite.config.ts).

### ESLint Configuration
The project uses ESLint with TypeScript and React plugins. For stricter linting rules, see the [Expanding the ESLint Configuration](#expanding-the-eslint-configuration) section.

### TailwindCSS
TailwindCSS is used for styling. You can customize styles in the `src/index.css` file.

---

## Expanding the ESLint Configuration

To enable type-aware linting rules, update the ESLint configuration in [`eslint.config.js`](eslint.config.js) as follows:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also add React-specific linting plugins:

```js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

---

## Future Improvements

- **Cart Functionality**: Complete the cart system to allow adding, removing, and updating items, as well as calculating totals.
- **Persistent State**: Use local storage or a backend API to persist cart and user preferences.
- **Enhanced Product Filtering**: Add more filters such as price range, brand, and availability.
- **Unit Tests**: Add unit tests for components using a testing library like Jest or React Testing Library.
- **Error Handling**: Improve error handling for GraphQL queries and API calls.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
