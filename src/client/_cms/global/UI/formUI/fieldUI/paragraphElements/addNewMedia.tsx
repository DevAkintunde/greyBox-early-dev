import React from "react";
import { jsStyler } from "../../../../functions/jsStyler";
import { MediaUi } from "../MediaUi";

type addProps = {
  type: string;
  handleInputData: Function;
  setDeleteParagraphFromBody: any;
  formData: FormData;
};
const addNewMedia = ({
  type,
  handleInputData,
  setDeleteParagraphFromBody,
  formData,
}: addProps) => {
  let newParagraphID = Math.random().toString(36).substring(2);
  let paragraphName = `body["${newParagraphID}"][${type}]`;

  return {
    id: newParagraphID,
    type: type,
    element: (
      <div
        id={paragraphName}
        className={"paragraph-form-item form-item form-item-" + type}
      >
        <div className={"paragraph-label paragraph-label-" + newParagraphID}>
          <label htmlFor={newParagraphID}>{`Add ${type}`}</label>
          <span id="paragraph-item-remover" className="jsstyler toggle">
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
                onClick={() => {
                  setDeleteParagraphFromBody({
                    uuid: newParagraphID,
                    type: type,
                  });
                  document
                    .getElementById("delete-paragraph-" + newParagraphID)
                    ?.click();
                }}
              />
              <input
                type="button"
                value="Cancel"
                onClick={() =>
                  document
                    .getElementById("delete-paragraph-" + newParagraphID)
                    ?.click()
                }
              />
            </div>
          </span>
        </div>
        <MediaUi
          type={type}
          id={paragraphName}
          name={`${paragraphName}[${type}]`}
          formData={formData}
          handleInputData={handleInputData}
          required={true}
          titleField={true}
        />
        <div
          id={"form-item-notice-" + newParagraphID}
          className="form-item-notice"
        ></div>
      </div>
    ),
  };
};

export { addNewMedia };
