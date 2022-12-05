import React from "react";
import { jsStyler } from "../../../../functions/jsStyler";

const addNewText: Function = (
  className: string,
  handleInputData: Function,
  setDeleteParagraphFromBody: any
) => {
  let newParagraphID = Math.random().toString(36).substring(2);
  let paragraphName = "body[" + newParagraphID + "][text]";

  return {
    id: newParagraphID,
    element: (
      <div
        id={paragraphName}
        className={"paragraph-form-item form-item form-item-text"}
      >
        <div className={"paragraph-label paragraph-label-" + newParagraphID}>
          <label htmlFor={newParagraphID}>{"Add Text"}</label>
          <span className="jsstyler toggle">
            <input
              id={"delete-paragraph-" + newParagraphID}
              type="button"
              value="remove"
              onClick={jsStyler()}
            />
            <div data-jsstyler-target={"delete-paragraph-" + newParagraphID}>
              <input
                type="button"
                value="Confirm Delete"
                onClick={() => setDeleteParagraphFromBody(newParagraphID)}
              />
            </div>
          </span>
        </div>
        <textarea
          id={newParagraphID}
          name={paragraphName + "[value]"}
          onChange={handleInputData({
            id: newParagraphID,
            name: paragraphName,
            type: "text",
          })}
          className={className}
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

export { addNewText };
