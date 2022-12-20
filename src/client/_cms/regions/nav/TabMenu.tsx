import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const TabMenu = ({ entity }: any) => {
  const location = useLocation();
  const [tab, setTab]: any = useState();

  //setTabs per entity type
  useEffect(() => {
    let isMounted = true;
    //common menu across entities
    let commonMenuItems = {
      View: {
        to: location.pathname.endsWith("/update")
          ? location.pathname.split("/update")[0]
          : location.pathname.endsWith("/update/alias")
          ? location.pathname.split("/update/alias")[0]
          : location.pathname.endsWith("/delete")
          ? location.pathname.split("/delete")[0]
          : location.pathname,
        title: "Edit content",
      },
      Edit: {
        to: location.pathname.endsWith("/update")
          ? location.pathname
          : location.pathname.endsWith("/update/alias")
          ? location.pathname.split("/alias")[0]
          : location.pathname.endsWith("/delete")
          ? location.pathname.split("/delete")[0] + "/update"
          : location.pathname + "/update",
        title: "Edit content",
      },
      "Update Alias": {
        to: location.pathname.endsWith("/update")
          ? location.pathname + "/alias"
          : location.pathname.endsWith("/update/alias")
          ? location.pathname
          : location.pathname.endsWith("/delete")
          ? location.pathname.split("/delete")[0] + "/update/alias"
          : location.pathname + "/update/alias",
        title: "Update url",
      },
      Delete: {
        to: location.pathname.endsWith("/update")
          ? location.pathname.split("/update")[0] + "/delete"
          : location.pathname.endsWith("/update/alias")
          ? location.pathname.split("/update/alias")[0] + "/delete"
          : location.pathname.endsWith("/delete")
          ? location.pathname
          : location.pathname + "/delete",
        title: "Delete content",
      },
    };
    if (location.pathname.startsWith("/auth/media"))
      commonMenuItems = { ...commonMenuItems };
    if (isMounted) setTab(commonMenuItems);
    return () => {
      isMounted = false;
    };
  }, [location.pathname, setTab]);

  return (
    tab &&
    Object.keys(tab).length > 0 &&
    Object.keys(tab).map((item: any, index: number) => {
      return (
        <motion.li
          className="list-none"
          whileHover={{ scale: 1.1 }}
          key={index}
        >
          <NavLink
            key={tab[item].to}
            to={tab[item].to}
            className={({ isActive }) =>
              "border-b-2 block p-3 text-center hover:text-yellow-900 hover:bg-amber-300" +
              (isActive ? " text-color-ter bg-amber-300" : " text-color-def")
            }
            title={tab[item].title}
          >
            {item}
          </NavLink>
        </motion.li>
      );
    })
  );
};
