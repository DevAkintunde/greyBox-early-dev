import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jsStyler } from "../functions/jsStyler";
//import { FaGripLines } from "react-icons/fa";

const MainNav = ({ routes }: any) => {
  const location = useLocation();
  const menuButton = (
    <>
      <div
        id="menuButton"
        style={{
          height: "6px",
          marginTop: "5px",
          width: "30px",
        }}
        className={"bg-color-pri"}
      ></div>
      <div
        id="menuButton"
        style={{
          height: "7px",
          margin: "5px 0",
          width: "22px",
        }}
        className={"bg-color-pri"}
      ></div>
    </>
  );
  useEffect(() => {
    if (location.pathname) {
      let targetElement = document.querySelector(
        `[jsstyler-toggle=menuButton]`
      );
      if (targetElement && targetElement.classList.contains("show")) {
        targetElement.classList.remove("show");
      }
    }
  }, [location.pathname]);

  const closeMenu = () => {
    let targetElement = document.querySelector(`[jsstyler-toggle=menuButton]`);
    if (targetElement && targetElement.classList.contains("show")) {
      targetElement.classList.remove("show");
    }
  };

  interface ThisRoute {
    name: string;
    path: string | undefined;
  }
  return (
    <nav className="jsstyler toggle absolute right-5 top-5 bg-color-def">
      <button id="menuButton" className="p-3" onClick={jsStyler()}>
        {menuButton}
      </button>

      <div
        className="fixed bottom-0 flex flex-col bg-color-pri bg-clip-padding shadow-sm top-0 left-0 right-0 mx-auto border-none w-96"
        //tabIndex={-1}
        jsstyler-toggle="menuButton"
      >
        <div className="flex items-center justify-between p-4">
          <div className="text-color-ter text-xl mb-0 font-semibold">Menu</div>
          <button type="button" className="py-2 px-4" onClick={closeMenu}>
            X
          </button>
        </div>
        <div className="flex-grow list-none overflow-y-auto scrollbar">
          {routes.map(({ name, path }: ThisRoute) => {
            return (
              <li key={name}>
                <NavLink
                  to={path ? path : "/"}
                  className={
                    "border-b-2 block p-3 text-center hover:text-color-def hover:bg-color-ter/60 hover:border-x-4" +
                    (location.pathname === "/" + (path ? path : "")
                      ? " text-color-def bg-color-ter border-color-ter/50"
                      : " text-color-sec")
                  }
                >
                  {name}
                </NavLink>
              </li>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MainNav;
