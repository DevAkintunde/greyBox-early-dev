import React, { useContext, useEffect } from "react";
import { FaGripLines } from "react-icons/fa";
import { NavLink, useLocation } from "react-router-dom";
import { TabMenu } from "../src/client/global/AppFrame";
import { AppSignOut } from "../src/client/global/functions/AppSignOut";
import { jsStyler } from "../src/client/global/functions/jsStyler";
import { motion, AnimatePresence, useCycle } from "framer-motion";

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
  ];

  const itemVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 },
  };
  const sideVariants = {
    closed: { transition: { staggerChildren: 0.2, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.2, staggerDirection: 1 } },
  };
  const [open, cycleOpen]: any = useCycle(false, true);
  const [collapse, cycleCollapse]: any = useCycle(false, true);

  return (
    <nav className="jsstyler toggle fixed z-50 right-0 bottom-5 bg-color-def">
      <button
        id="UserMenuButton"
        className="p-1 relative float-right"
        onClick={cycleOpen}
      >
        {menuButton}
      </button>

      <AnimatePresence>
        {open && (
          <motion.aside
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            exit={{
              width: 0,
              transition: { delay: 0.7, duration: 0.3 },
            }}
            className="relative"
            //tabIndex={-1}
            //data-jsstyler-target="UserMenuButton"
          >
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={sideVariants}
              className="absolute bottom-10 right-5 left-0 py-4 bg-color-ter shadow-sm"
              //data-jsstyler-target="userMenuAccordions"
            >
              {/* Import per entity menu through context */}
              {tab && Object.keys(tab).length > 0
                ? Object.keys(tab).map((thisMenu, index) => {
                    return (
                      <NavLink
                        key={thisMenu + index}
                        to={tab[thisMenu]}
                        className={({ isActive }) =>
                          "border-b-2 block p-2 w-full text-color-def hover:bg-color-pri/50" +
                          (isActive ? " bg-color-pri/80" : "")
                        }
                        title={thisMenu}
                      >
                        {thisMenu}
                      </NavLink>
                    );
                  })
                : null}
              <hr className="w-full h-1 bg-color-pri" />
              <ul>
                <li>
                  <NavLink
                    to="dashboard"
                    className={({ isActive }) =>
                      "border-b-2 block p-3 text-center hover:text-yellow-900 hover:bg-amber-300 hover:border-r-4" +
                      (isActive
                        ? " text-color-ter bg-amber-300 border-r-4"
                        : " text-color-def")
                    }
                    title="Dashboard"
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="auth/pages/create">New Page</NavLink>
                </li>
                <nav className="relative group jsstyler accordion">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    variants={itemVariants}
                    className={
                      "w-full relative border-b-2 p-3 group-hover:border-r-4 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-def items-center"
                    }
                    type="button"
                    //id="userMenuAccordions"
                    onClick={cycleCollapse}
                  >
                    Media
                    <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                  </motion.button>
                  {collapse && (
                    <motion.ul
                      /* initial="collapse"
                      animate="open"
                      exit="collapse" */
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{
                        height: 0,
                        transition: { delay: 0.7, duration: 0.3 },
                      }}
                      //variants={treeVariants}
                      //data-jsstyler-target="userMenuAccordions"
                    >
                      {mediaMenuItems.map((item) => {
                        return (
                          <motion.li whileHover={{ scale: 1.02 }}>
                            <NavLink
                              key={item.to}
                              to={item.to}
                              className={
                                "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 active:bg-color-pri/80"
                              }
                              title={item.title}
                            >
                              {item.label}
                            </NavLink>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  )}
                </nav>

                <nav className="relative group jsstyler accordion">
                  <button
                    className={
                      "w-full relative border-b-2 p-3 group-hover:border-r-4 group-hover:text-yellow-900 hover:bg-amber-300 group-hover:bg-amber-300 active:bg-amber-300 text-color-sec transition duration-150 ease-in-out items-center whitespace-nowrap"
                    }
                    type="button"
                    id="userMenuAccordions"
                    onClick={jsStyler()}
                  >
                    Profile
                    <FaGripLines className="absolute right-4 top-0 bottom-0 h-full" />
                  </button>
                  <ul data-jsstyler-target="userMenuAccordions">
                    <li>
                      <NavLink
                        to="auth/update"
                        className={({ isActive }) =>
                          "border-b-2 block p-3 pl-6 w-full whitespace-nowrap text-color-def hover:bg-color-pri/50" +
                          (isActive ? " bg-color-pri/80" : "")
                        }
                        title="Update Profile"
                      >
                        Update Profile
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="auth/update-password">
                        Update Password
                      </NavLink>
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
            </motion.nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default UserMenu;
