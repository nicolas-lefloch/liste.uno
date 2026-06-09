import { createBrowserRouter, Navigate, redirect } from "react-router-dom";

import ShoppingListLayout from "./routes/ShoppingListLayout";
import BuildListPage from "./routes/BuildListPage";
import ShoppingPage from "./routes/ShoppingPage";
import LocalStorageInterface from "./services/LocalStorageInterface";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate
        to={`/${LocalStorageInterface.getCurrentListId()}/build-list`}
        replace
      />
    ),
  },
  {
    path: "/:listID",
    loader: ({ params }) => redirect(`/${params.listID}/build-list`),
  },
  {
    element: <ShoppingListLayout />,
    children: [
      {
        path: "/:listID/build-list/:action?/:editedItemKey?",
        element: <BuildListPage />,
      },
      {
        path: "/:listID/shopping",
        element: <ShoppingPage />,
      },
    ],
  },
]);
