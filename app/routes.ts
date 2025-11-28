import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix,
} from "@react-router/dev/routes";
import { redirect } from "react-router";

export default [
  route("/", "./routes/RedirectToCurrentList.tsx"),
  route("/:listID", "./routes/RedirectToBuildList.tsx"),
  layout("./routes/ShoppingListLayout.tsx", [
    route("/:listID/build-list/:action?/:editedItemKey?", "./routes/BuildListPage.tsx"),
    route("/:listID/shopping", "./routes/ShoppingPage.tsx"),
  ]),
] satisfies RouteConfig;