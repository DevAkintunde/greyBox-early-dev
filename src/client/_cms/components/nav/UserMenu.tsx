import React, { useContext, useEffect } from "react";
import { FaGripLines } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { AppSignOut } from "../../global/functions/AppSignOut";
import { jsStyler } from "../../global/functions/jsStyler";
import { motion } from "framer-motion";
import { TabMenu } from "./TabMenu";
import { Profile } from "../../global/AuthFrame";

const UserMenu = () => {
  const { profile }: any = useContext(Profile);
  const location = useLocation();
  //control tab menu visibility

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
        `[data-jsstyler-target=UserMenuButton]`
      );
      if (targetElement && targetElement.classList.contains("show")) {
        targetElement.classList.remove("show");
      }
    }
  }, [location.pathname]);

  const closeModal = () => {
    let targetElement = document.querySelector(
      `[data-jsstyler-target=UserMenuButton]`
    );
    if (targetElement && targetElement.classList.contains("show")) {
      targetElement.classList.remove("show");
    }
  };
  //media menu
  const mediaMenuItems = [
    {
      label: "All Media",
      to: "auth/media",
      title: "Browse media files",
    },
    {
      label: "Upload Media",
      to: "auth/media/add",
      title: "Add new media",
    },
    {
      label: "Images",
      to: "auth/media/images",
      title: "Browse images",
    },
    {
      label: "Videos",
      to: "auth/media/videos",
      title: "Browse videos",
    },
  ];
  //pages links
  const pagesMenuItems = [
    {
      label: "Pages",
      to: "auth/pages",
      title: "Manage pages",
    },
    {
      label: "Create page",
      to: "auth/pages/create",
      title: "Create new page",
    },
  ];
  //pages links
  const blogMenuItems = [
    {
      label: "Blog",
      to: "auth/blog",
      title: "Manage Blog",
    },
    {
      label: "Create article",
      to: "auth/blog/create",
      title: "Create new blog article",
    },
  ];
  //profile links
  const profileMenuItems = [
    {
      label: "View",
      to: "auth/profile",
      title: "View Profile",
    },
    {
      label: "Update Profile",
      to: "auth/profile/update",
      title: "Update Profile",
    },
    {
      label: "Update Password",
      to: "auth/profile/update-password",
      title: "Update your Password",
    },
  ];
  //accounts management menu
  const adminRegisteredAccountsMenuItems = [
    {
      label: "Accounts",
      to: "auth/accounts",
      title: "Browse registered accounts",
    },
    {
      label: "Create new",
      to: "auth/accounts/create",
      title: "Create new account",
    },
  ];

  return (
    <nav className="jsstyler toggle fixed z-50 right-5 bottom-5 bg-color-def">
      <button id="UserMenuButton" className="p-1 relative" onClick={jsStyler()}>
        {menuButton}
      </button>

      <aside
        className="absolute bottom-10 py-4 bg-color-ter shadow-sm"
        //tabIndex={-1}
        data-jsstyler-target="UserMenuButton"
      >
        {profile && profile.uuid ? (
          <>
            {/* Import per entity tab menu */}
            <TabMenu />
            <hr className="w-full h-1 bg-color-pri" />
            <ul>
              <motion.li whileHover={{ scale: 1.1 }}>
                <NavLink
                  to="auth/dashboard"
                  className={({ isActive }) =>
                    "border-b-2 block p-3 text-center hover:text-yellow-900 hover:bg-amber-300" +
                    (isActive
                      ? " text-color-ter bg-amber-300"
                      : " text-color-def")
                  }
                  title="Dashboard"
                >
                  Dashboard
                </NavLink>
              </motion.li>

              <nav className="relative jsstyler accordion">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className={
                    "w-full relative border-b-2 p-3 hover:bg-amber-300 text-color-def items-center"
                  }
                  type="button"
                  id="userManagementAccordions"
                  onClick={jsStyler()}
                >
                  Manage
                  <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                </motion.button>
                <ul data-jsstyler-target="userManagementAccordions">
                  <nav className="relative group jsstyler accordion">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className={
                        "w-full relative border-b-2 p-3 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-def items-center"
                      }
                      type="button"
                      id="entityManagementAccordions"
                      onClick={jsStyler()}
                    >
                      Pages
                      <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                    </motion.button>
                    <ul data-jsstyler-target="entityManagementAccordions">
                      {pagesMenuItems.map((item, index) => {
                        return (
                          <motion.li whileHover={{ scale: 1.02 }} key={index}>
                            <NavLink
                              key={item.to}
                              to={item.to}
                              className={({ isActive }) =>
                                "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
                                (isActive ? " bg-color-pri/80" : "")
                              }
                              title={item.title}
                            >
                              {item.label}
                            </NavLink>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  <nav className="relative group jsstyler accordion">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className={
                        "w-full relative border-b-2 p-3 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-def items-center"
                      }
                      type="button"
                      id="entityManagementAccordions"
                      onClick={jsStyler()}
                    >
                      Blog
                      <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                    </motion.button>
                    <ul data-jsstyler-target="entityManagementAccordions">
                      {blogMenuItems.map((item, index) => {
                        return (
                          <motion.li whileHover={{ scale: 1.02 }} key={index}>
                            <NavLink
                              key={item.to}
                              to={item.to}
                              className={({ isActive }) =>
                                "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
                                (isActive ? " bg-color-pri/80" : "")
                              }
                              title={item.title}
                            >
                              {item.label}
                            </NavLink>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  <nav className="relative group jsstyler accordion">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className={
                        "w-full relative border-b-2 p-3 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-def items-center"
                      }
                      type="button"
                      id="entityManagementAccordions"
                      onClick={jsStyler()}
                    >
                      Media
                      <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                    </motion.button>
                    <ul data-jsstyler-target="entityManagementAccordions">
                      {mediaMenuItems.map((item, index) => {
                        return (
                          <motion.li whileHover={{ scale: 1.02 }} key={index}>
                            <NavLink
                              key={item.to}
                              to={item.to}
                              className={({ isActive }) =>
                                "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
                                (isActive ? " bg-color-pri/80" : "")
                              }
                              title={item.title}
                            >
                              {item.label}
                            </NavLink>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>

                  <nav className="relative group jsstyler accordion">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className={
                        "w-full relative border-b-2 p-3 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-def items-center"
                      }
                      type="button"
                      id="entityManagementAccordions"
                      onClick={jsStyler()}
                    >
                      Admin
                      <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                    </motion.button>
                    <ul data-jsstyler-target="entityManagementAccordions">
                      {adminRegisteredAccountsMenuItems.map((item, index) => {
                        return (
                          <motion.li whileHover={{ scale: 1.02 }} key={index}>
                            <NavLink
                              key={item.to}
                              to={item.to}
                              className={({ isActive }) =>
                                "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
                                (isActive ? " bg-color-pri/80" : "")
                              }
                              title={item.title}
                            >
                              {item.label}
                            </NavLink>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>
                  <motion.li whileHover={{ scale: 1.02 }}>
                    <NavLink
                      to="auth/bin"
                      className={({ isActive }) =>
                        "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
                        (isActive ? " bg-color-pri/80" : "")
                      }
                      title="Delete items"
                    >
                      {"Bin"}
                    </NavLink>
                  </motion.li>
                </ul>
              </nav>

              <nav className="relative group jsstyler accordion">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  className={
                    "w-full relative border-b-2 p-3 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-def items-center"
                  }
                  type="button"
                  id="userManagementAccordions"
                  onClick={jsStyler()}
                >
                  Profile
                  <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                </motion.button>
                <ul data-jsstyler-target="userManagementAccordions">
                  {profileMenuItems.map((item, index) => {
                    return (
                      <motion.li whileHover={{ scale: 1.02 }} key={index}>
                        <NavLink
                          key={item.to}
                          to={item.to}
                          className={({ isActive }) =>
                            "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
                            (isActive ? " bg-color-pri/80" : "")
                          }
                          title={item.title}
                        >
                          {item.label}
                        </NavLink>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              <motion.li
                whileHover={{ scale: 1.1 }}
                className={
                  "border-b-2 block p-3 text-center hover:text-yellow-900 hover:bg-amber-300 text-color-def"
                }
                title="Sign out account"
                onClick={AppSignOut}
              >
                Sign Out
              </motion.li>
            </ul>
          </>
        ) : (
          <ul>
            <motion.li
              whileHover={{ scale: 1.1 }}
            >
              <NavLink
                to="admin/sign-in"
                className={({ isActive }) =>
                  "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
                  (isActive ? " bg-color-pri/80" : "")
                }
                title='Sign In'
              >
                Sign In
              </NavLink>
            </motion.li>
          </ul>
        )}
      </aside>
    </nav>
  );
};

export default UserMenu;
