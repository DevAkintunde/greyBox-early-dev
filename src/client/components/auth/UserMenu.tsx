import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { jsStyler } from "../../global/functions/jsStyler";

const UserMenu = () => {
  const location = useLocation();
  const menuButton = (
    <>
      <input
        value={"My menu"}
        id="UserMenuButton"
        type="button"
        className="text-xl first-letter:text-2xl font-extrabold"
      />
      <div
        id="UserMenuButton"
        className={
          "-z-10 absolute -left-3 -top-2 bg-color-pri border-8 border-color-ter/30 p-4 rounded-full"
        }
      />
    </>
  );

  useEffect(() => {
    if (location.pathname) {
      let targetElement = document.querySelector(
        `[jsstyler-toggle=UserMenuButton]`
      );
      if (targetElement && targetElement.classList.contains("show")) {
        targetElement.classList.remove("show");
      }
    }
  }, [location.pathname]);

  const closeModal = () => {
    let targetElement = document.querySelector(
      `[jsstyler-toggle=UserMenuButton]`
    );
    if (targetElement && targetElement.classList.contains("show")) {
      targetElement.classList.remove("show");
    }
  };
  return (
    <nav className="jsstyler toggle fixed z-50 right-5 bottom-5 bg-color-def">
      <button id="UserMenuButton" className="p-1 relative" onClick={jsStyler()}>
        {menuButton}
      </button>

      <div
        className="absolute bottom-10 px-4 py-10 bg-color-ter shadow-sm"
        //tabIndex={-1}
        jsstyler-toggle="UserMenuButton"
      >
        <ul>
          <li>
            <NavLink to="dashboard">Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="auth/pages/create">New Page</NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default UserMenu;
