import { Route, Routes } from "react-router-dom";
import MainNav from "./client/_cms/regions/nav/MainNav";
import { Router } from "./client/_cms/routes/Router";
import AppFrame from "./client/_cms/global/AppFrame";
import bgImage from "./assets/lens-contour2.png";
import QuickButtons from "./client/_cms/regions/nav/QuickButtons";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//server conditional logic
//import.meta.env.SSR

const PagePathsWithComponents: object = import.meta.glob(
  "./client/_cms/routes/public/*.tsx",
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
    let nameHolder = path.match(
      /\.\/client\/_cms\/routes\/public\/(.*)\.tsx$/
    )![1];
    let nameWeight = nameHolder.split("_");
    let thisPath =
      nameWeight[0] === "Home" ? undefined : nameWeight[0].toLowerCase();
    return {
      name: nameWeight[0],
      weight: Number(nameWeight[nameWeight.length - 1]),
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
  return (
    <AppFrame
      app={
        <div
          id="app"
          className="relative scrollbar"
          style={{
            backgroundImage: "url(" + bgImage + ")",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "left",
            backgroundBlendMode: "overlay",
          }}
        >
          <QuickButtons />
          {routes && routes.length > 0 ? (
            <>
              <MainNav routes={routes} />

              <Routes>
                {routes.map(
                  ({ name, path, component: RouteComp }: ThisRoute) => {
                    return (
                      <Route
                        key={name}
                        path={path ? path : "/"}
                        element={
                          <RouteComp className={!path ? "" : "app-container"} />
                        }
                      />
                    );
                  }
                )}
              </Routes>
            </>
          ) : null}
          <Router />
          <ToastContainer
            position="top-right"
            autoClose={10000}
            closeOnClick={false}
            pauseOnHover
            theme="light"
          />
          ;
        </div>
      }
    />
  );
}

export default ClientApp;
