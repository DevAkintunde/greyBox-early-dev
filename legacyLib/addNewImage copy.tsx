import React from "react";
import { jsStyler } from "../../../functions/jsStyler";
import { ImageUi } from "../fieldUI/ImageUi";

const addNewImage: Function = (
  handleInputData: Function,
  setDeleteParagraphFromBody: any,
  formData: FormData
) => {
  let newParagraphID = Math.random().toString(36).substring(2);
  let paragraphName = "body[" + newParagraphID + "][image]";

  return {
    id: newParagraphID,
    element: (
      <div
        id={paragraphName}
        className={"paragraph-form-item form-item form-item-image"}
      >
        <div className={"paragraph-label paragraph-label-" + newParagraphID}>
          <label htmlFor={newParagraphID}>{"Add Image"}</label>
          <span className="jsstyler toggle">
            <input
              id={"delete-paragraph-" + newParagraphID}
              type="button"
              value="remove"
              onClick={jsStyler()}
            />
            <div jsstyler-toggle={"delete-paragraph-" + newParagraphID}>
              <input
                type="button"
                value="Confirm Delete"
                onClick={() => setDeleteParagraphFromBody(newParagraphID)}
              />
            </div>
          </span>
        </div>
        <ImageUi
          id={paragraphName}
          name={paragraphName + "][uuid]"}
          formData={formData}
          handleInputData={handleInputData}
          required={true}
        />
        <div
          id={"form-item-notice-" + newParagraphID}
          className="form-item-notice"
        ></div>
      </div>
    ),
  };
};

export { addNewImage };
