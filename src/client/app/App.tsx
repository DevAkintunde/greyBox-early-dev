import { Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import MainNav from "./regions/nav/MainNav";
import Router  from "./Router";
import ContactButton from "./components/blocks/ContactButton";

//server conditional logic
//import.meta.env.SSR

const PagePathsWithComponents: object = import.meta.glob(
  "./routes/public/*.tsx",
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
    let nameHolder = path.match(/\.\/routes\/public\/(.*)\.tsx$/)![1];
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

export function App() {
  return (
    <div id='app'>
      <ContactButton /> 
      {routes && routes.length > 0 ? (
        <>
          <MainNav routes={routes} />

          <Routes>
            {routes.map(({ name, path, component: RouteComp }: ThisRoute) => {
              return (
                <Route
                  key={name}
                  path={path ? path : "/"}
                  element={
                    <RouteComp />
                  }
                />
              );
            })}
          </Routes>
        </>
      ) : null}
      <Router />
    </div>
  );
}

export default App;
