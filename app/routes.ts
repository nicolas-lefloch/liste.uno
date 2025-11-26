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
  layout("./routes/ShoppingListLayout.tsx", [
    route("/:listID/build-list", "./routes/BuildListPage.tsx"),
    route("/:listID/shopping", "./routes/ShoppingPage.tsx"),
  ]),
] satisfies RouteConfig;