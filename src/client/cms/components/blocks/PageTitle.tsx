import { SITENAME } from "../../utils/app.config";
import React, { useEffect } from "react";

const PageTitle = ({ title }: any) => {
  useEffect(() => {
    let isMounted = true;
    let headerTitle = document.querySelector("title");
    if (headerTitle && isMounted)
      if (title) {
        headerTitle.innerText = title + " | " + SITENAME;
      } else {
        headerTitle.innerText = SITENAME;
      }
    return () => {
      isMounted = false;
    };
  }, [title]);

  return title ? (
    <header className={"mt-3 mb-3"} id="pageTitle">
      <h1 className={"capitalize m-0 text-center"}>{title}</h1>
    </header>
  ) : null;
};
export default PageTitle;
