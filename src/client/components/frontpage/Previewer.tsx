import React from "react";

export const Previewer = ({ content }) => {
  let defaultPreview = "Welcome";

  return (
    <div className="pl-3 py-10">
      <div className={"p-1" + (!content ? " text-5xl" : "")}>
        {content ? content : defaultPreview}
      </div>
      contact button
      <br />
    </div>
  );
};
