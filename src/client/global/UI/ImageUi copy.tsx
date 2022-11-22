import React, { useEffect, useState } from "react";
import { APP_ADDRESS } from "../../utils/app.config";

export const ImageUi = ({
  defaultValue,
  id,
  name,
  className,
  required,
  handleInput,
}: {
  defaultValue: any;
  id: string;
  name: string;
  className: string;
  required: boolean;
  handleInput: any;
}) => {
  const imageDefaultPreview = defaultValue
    ? APP_ADDRESS + "/" + defaultValue
    : null;
  const [preview, setPreview] = useState(imageDefaultPreview);

  const imageChangeEvent = (e: any) => {
    //console.log("target", e.target.files[0]);
    //console.log(URL.createObjectURL(e.target.files[0]));
    setPreview(URL.createObjectURL(e.target.files[0]));
  };

  const imageRemover = (e: any) => {
    let getImageInput: any = document.querySelector("input#" + id);
    if (getImageInput) getImageInput["value"] = "";
    setPreview(null);
  };

  useEffect(() => {}, []);

  return (
    <>
      {preview ? (
        <span>
          <img
            id={id + "-preview"}
            src={preview}
            alt="preview"
            style={{ width: "100px" }}
          />
          <input
            type="button"
            value="Remove"
            onClick={(e) => {
              handleInput(e);
              imageRemover(e);
            }}
          />
        </span>
      ) : null}
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        id={id}
        name={name}
        className={className}
        required={required}
        onChange={(e) => {
          handleInput(e);
          imageChangeEvent(e);
        }}
      />
    </>
  );
};
