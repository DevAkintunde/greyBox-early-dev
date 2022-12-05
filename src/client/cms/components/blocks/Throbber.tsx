import React from "react";

export const Throbber = () => {
  return (
    <div className="p-3 bg-color-pri w-[40px] h-[40px] mx-auto rounded-full animate-ping">
      <div className="p-1 bg-color-ter/70 w-[10px] h-[10px] mx-auto rounded-full animate-ping" />
    </div>
  );
};
