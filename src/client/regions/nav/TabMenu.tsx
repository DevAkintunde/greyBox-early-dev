import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export const TabMenu = ({ entity }: any) => {
  const location = useLocation();
  const [tab, setTab]: any = useState();

  //setTabs per entity type
  useEffect(() => {
    let isMounted = true;
    //media
    const commonMenuItems = {
      Edit: { to: location.pathname + "/update", title: "Edit content" },
    };
    const mediaItems = {
      ...commonMenuItems,
      Edit: { to: location.pathname + "/update", title: "Edit content" },
    };

    if (isMounted) {
      if (location.pathname.startsWith("/auth/media")) setTab(mediaItems);
    }
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
