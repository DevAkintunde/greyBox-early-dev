import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jsStyler } from "../../global/functions/jsStyler";
import SocialMediaLinks from "../../components/blocks/SocialMediaLinks";
//import { FaGripLines } from "react-icons/fa";

const MainNav = ({ routes }: any) => {
  const location = useLocation();

  const [serviceList, setServiceList] = useState([
    { name: "Photography", path: "photography" },
    { name: "Videography", path: "Videography" },
    { name: "Story Development", path: "Development" },
  ]);

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
        `[data-jsstyler-target=menuButton]`
      );
      if (targetElement && targetElement.classList.contains("show")) {
        targetElement.classList.remove("show");
      }
    }
  }, [location.pathname]);

  const closeMenu = () => {
    let targetElement = document.querySelector(
      `[data-jsstyler-target=menuButton]`
    );
    if (targetElement && targetElement.classList.contains("show")) {
      targetElement.classList.remove("show");
    }
  };

  interface ThisRoute {
    name: string;
    path: string | undefined;
  }
  return (
    <nav className="jsstyler toggle absolute z-10 right-5 top-5 bg-color-def border-8 border-color-pri">
      <button id="menuButton" className="p-2" onClick={jsStyler()}>
        {menuButton}
      </button>

      <div
        className="fixed z-10 bottom-0 flex flex-col bg-color-pri bg-clip-padding shadow-sm top-0 left-0 right-0 mx-auto border-none w-96"
        //tabIndex={-1}
        data-jsstyler-target="menuButton"
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
                {path === "services" && serviceList && serviceList.length > 0
                  ? serviceList.map((service) => {
                      return (
                        <NavLink
                          key={service.path}
                          to={service.path ? service.path : "/"}
                          className={
                            "border-b-2 block p-3 text-center hover:text-color-def hover:bg-color-ter/60 hover:border-x-4" +
                            (location.pathname ===
                            "/" + (service.path ? service.path : "")
                              ? " text-color-def bg-color-ter border-color-ter/50"
                              : " text-color-sec")
                          }
                        >
                          {service.name}
                        </NavLink>
                      );
                    })
                  : null}
              </li>
            );
          })}
          <li>
            <NavLink
              to="account"
              className={
                "border-b-2 block p-3 text-center hover:text-color-def hover:bg-color-ter/60 hover:border-x-4" +
                (location.pathname === "staff-login"
                  ? " text-color-def bg-color-ter border-color-ter/50"
                  : " text-color-sec")
              }
            >
              Staff Login
            </NavLink>
          </li>
        </div>
      </div>
      <SocialMediaLinks />
    </nav>
  );
};

export default MainNav;
