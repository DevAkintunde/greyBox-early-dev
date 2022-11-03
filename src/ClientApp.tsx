import { Link, Route, Routes } from "react-router-dom";
import MainNav from "./client/components/MainNav";
//server conditional logic
//import.meta.env.SSR

const PagePathsWithComponents: object = import.meta.glob(
  "./client/routes/*.tsx",
  { eager: true }
);

interface ThisRoute {
  name: string;
  path: string | undefined;
  weight: number;
  component?: any;
}
let routes: ThisRoute[] = Object.keys(PagePathsWithComponents).map(
  (path: string) => {
    let nameHolder = path.match(/\.\/client\/routes\/(.*)\.tsx$/)![1];
    let nameWeight = nameHolder.split("_");
    let thisPath =
      nameWeight[0] === "Home" ? undefined : nameWeight[0].toLowerCase();
    return {
      name: nameWeight[0],
      weight: Number(nameWeight[1]),
      path: thisPath,
      component:
        PagePathsWithComponents[path as keyof typeof PagePathsWithComponents][
          nameWeight[0]
        ],
    };
  }
);
routes.sort((a, b) => a.weight - b.weight);

export function ClientApp() {
  return routes && routes.length > 0 ? (
    <div id="main" className="relative">
      <MainNav routes={routes} />
      <Routes>
        {routes.map(({ name, path, component: RouteComp }: ThisRoute) => {
          return (
            <Route
              key={name}
              path={path ? path : "/"}
              element={<RouteComp />}
            />
          );
        })}
      </Routes>
    </div>
  ) : null;
}

export default ClientApp;
