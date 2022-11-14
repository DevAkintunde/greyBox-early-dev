import React, { useContext, useEffect } from "react";
import { FaGripLines } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { TabMenu } from "../../global/AppFrame";
import { AppSignOut } from "../../global/functions/AppSignOut";
import { jsStyler } from "../../global/functions/jsStyler";

const UserMenu = () => {
  const { tab }: any = useContext(TabMenu);
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
        {/* Import per entity menu through context */}
        {tab && Object.keys(tab).length > 0
          ? Object.keys(tab).map((thisMenu) => {
              return (
                <li>
                  <NavLink
                    to={tab[thisMenu]}
                    className={({ isActive }) =>
                      "border-b-2 block p-3 text-center hover:text-yellow-900 hover:bg-amber-300 hover:border-r-4" +
                      (isActive
                        ? " text-color-ter bg-amber-300 border-r-4"
                        : " text-color-sec")
                    }
                    title={thisMenu}
                  >
                    {thisMenu}
                  </NavLink>
                </li>
              );
            })
          : null}
        <ul>
          <li>
            <NavLink
              to="dashboard"
              className={({ isActive }) =>
                "border-b-2 block p-3 text-center hover:text-yellow-900 hover:bg-amber-300 hover:border-r-4" +
                (isActive
                  ? " text-color-ter bg-amber-300 border-r-4"
                  : " text-color-sec")
              }
              title="Dashboard"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="auth/pages/create">New Page</NavLink>
          </li>
          <li>
            <NavLink to="auth/media">Media</NavLink>
          </li>
          <li>
            <NavLink to="auth/media/images">Images</NavLink>
          </li>
          <li>
            <NavLink to="auth/media/add">Upload Media</NavLink>
          </li>
          <nav className="relative group jsstyler accordion">
            <button
              className={
                "w-full relative border-b-2 p-3 group-hover:border-r-4 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-sec transition duration-150 ease-in-out items-center whitespace-nowrap"
              }
              type="button"
              aria-expanded="false"
              onClick={jsStyler()}
            >
              Profile
              <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
            </button>
            <ul>
              <li>
                <NavLink
                  to="auth/update"
                  className={({ isActive }) =>
                    "border-b-2 block p-3 pl-6 w-full whitespace-nowrap text-color-def hover:bg-color-pri/50" +
                    (isActive ? " bg-color-pri/80" : "")
                  }
                  title="Browse all scopes"
                >
                  Update Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="auth/update-password">Update Password</NavLink>
              </li>
            </ul>
          </nav>

          <li>
            <NavLink to="auth/create-account">Create an Account</NavLink>
          </li>
          <li>
            <span className="nav-link" onClick={AppSignOut}>
              Sign Out
            </span>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default UserMenu;
