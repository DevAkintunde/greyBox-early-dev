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
        <motion.li whileHover={{ scale: 1.02 }} key={index}>
          <NavLink
            key={tab[item].to}
            to={tab[item].to}
            className={({ isActive }) =>
              "border-b-2 block p-3 pl-6 w-full text-color-def hover:bg-color-pri/50 text-center" +
              (isActive ? " bg-color-pri/80" : "")
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
