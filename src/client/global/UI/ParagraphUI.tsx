import React, { ReactElement, useEffect, useState } from "react";
import validator from "validator";
import { jsStyler } from "../functions/jsStyler";
import { ImageUi } from "./ImageUi";
import { VideoUi } from "./VideoUi";

interface pParagraphUI {
  id: string;
  name: string;
  formData: any;
  setFormData: any;
  className: string;
  defaultValue: any;
  required: boolean;
}
export const ParagraphUI = ({
  id,
  name,
  formData,
  setFormData,
  className,
  defaultValue,
  required,
}: pParagraphUI) => {
  interface DefaultValues {
    type: string; //textfield, textarea, radio, phone, password, checkbox
    weight?: number;
    label: string;
    id: string;
    required?: boolean; //yet to be implemented
    defaultValue?: number | string | any;
    styling?: string;
    description?: { before: string } | { after: string } | string; // use as field description text
    extraElement?: ReactElement | null; // Extra react component that can be inserted along with each field
  }

  //set initial paragraph field values
  const [initialParagraphValues, setInitialParagraphValues] = useState(false);
  useEffect(() => {
    if (
      initialParagraphValues === false &&
      formData &&
      defaultValue &&
      defaultValue.length > 0
    ) {
      let importedData: FormData = formData;
      //starting at -ve 1 to compensate for the speed difference between React SetState and variable update
      let defaultIndex = -1;
      defaultValue.forEach((paragraph: any) => {
        if (typeof paragraph.defaultValue === "string") {
          importedData.set(
            "body[" + paragraph.id + "][" + paragraph.type + "][value]",
            paragraph.defaultValue
          );
          defaultIndex++;
          importedData.set(
            "body[" + paragraph.id + "][" + paragraph.type + "][weight]",
            defaultIndex.toString()
          );
        } else if (
          typeof paragraph.defaultValue === "object" &&
          Object.keys(paragraph.defaultValue).length > 0
        ) {
          Object.keys(paragraph.defaultValue).forEach((key) => {
            importedData.set(
              "body[" + paragraph.id + "][" + paragraph.type + "][" + key + "]",
              paragraph.defaultValue[key]
            );
          });
          defaultIndex++;
          importedData.set(
            "body[" + paragraph.id + "][" + paragraph.type + "][weight]",
            defaultIndex.toString()
          );
        }
      });
      setInitialParagraphValues(true);
      setFormData(importedData);
    }
  }, [defaultValue, formData, id, initialParagraphValues, setFormData]);

  const handleInputData =
    (paragraphProps: {
      name: string;
      id: string;
      type: string;
      value?: string;
    }) =>
    (e: { target: { value: string } | any }) => {
      // input value from the form
      let { name, id, value } =
        paragraphProps && paragraphProps.type !== "image"
          ? e.target
          : paragraphProps;

      //process validation
      let errorInsert = document.getElementById("form-item-notice-" + id);
      if (paragraphProps.type === "text" && validator.isEmpty(value)) {
        if (errorInsert) errorInsert.textContent = "Add text to field";
      } else if (paragraphProps.type === "video" && validator.isEmpty(value)) {
        if (errorInsert) errorInsert.textContent = "Add content to field";
        return;
      }
      if (errorInsert && errorInsert.textContent) errorInsert.textContent = "";

      //falsify disabled attribute on submit
      let submitButton: any = document.querySelector("input[type=submit]");
      if (submitButton && submitButton["disabled"])
        submitButton["disabled"] = false;

      //updating for data state taking previous state and then adding new values
      //delete form's field key once field is re-emptied
      let importedData: FormData = formData;
      if (value) {
        importedData.set(name, value);
      } else if (!value && importedData.has(name)) {
        importedData.delete(name);
      }
      //generate weights of paragraphs by their html element placement
      let paragraphElements = document.querySelectorAll(".paragraph-form-item");
      paragraphElements.forEach((paragraph, index) => {
        if (importedData.has(name)) {
          importedData.set(paragraph.id + "[weight]", index.toString());
        } else if (importedData.has(paragraph.id + "[weight]")) {
          importedData.delete(paragraph.id + "[weight]");
        }
      });
      setFormData(importedData);
    };

  //paragraph remover/deleter
  const deleteParagraphFromBody = () => {
    console.log("oya naa");
    let createNoticeElement = document.createElement("div");
    //createNoticeElement.setAttribute("id", 'deletethisParagraph');
    //createNoticeElement.onchange = "";
    createNoticeElement.innerText = "Add Text";
  };

  /* process imported paragraphs from server with editing entities */
  let paragraphDefaults: any[] = defaultValue ? defaultValue : null;
  if (paragraphDefaults && paragraphDefaults.length > 0) {
    paragraphDefaults.sort((a, b): any => a.weight - b.weight);
  }

  let ParagraphFields: any[] | null =
    paragraphDefaults && paragraphDefaults.length > 0
      ? paragraphDefaults.map((field: DefaultValues, index: number) => {
          return (
            <React.Fragment key={index}>
              <div
                id={"body[" + field.id + "][" + field.type + "]"}
                className={
                  "paragraph-form-item form-item form-item-" + field.type
                }
              >
                <div className={"paragraph-label paragraph-label-" + field.id}>
                  <label
                    htmlFor={field.id}
                    /* className={
                    "form-label" + (labelStyling ? " " + inputStyling : "")
                  } */
                  >
                    {field.type === "video"
                      ? "Add Video"
                      : field.type === "image"
                      ? "Add Image"
                      : "Add Text"}
                    {field.label}
                  </label>
                  <span className="jsstyler toggle">
                    <input
                      id={"delete-paragraph-" + field.id}
                      type="button"
                      value="remove"
                      onClick={jsStyler()}
                    />
                    <div jsstyler-toggle={"delete-paragraph-" + field.id}>
                      <input
                        type="button"
                        value="Confirm Delete"
                        onClick={deleteParagraphFromBody}
                      />
                    </div>
                  </span>
                </div>
                {field.type && field.type === "image" ? (
                  <ImageUi
                    id={"body[" + field.id + "][" + field.type + "]"}
                    name={"body[" + field.id + "][" + field.type + "][uuid]"}
                    defaultValue={
                      field.defaultValue ? field.defaultValue : null
                    }
                    formData={formData}
                    handleInputData={handleInputData}
                    required={true}
                  />
                ) : field.type && field.type === "video" ? (
                  <VideoUi
                    id={"body[" + field.id + "][" + field.type + "]"}
                    name={"body[" + field.id + "][" + field.type + "][uuid]"}
                    defaultValue={
                      field.defaultValue ? field.defaultValue : null
                    }
                    formData={formData}
                    handleInputData={handleInputData}
                    required={true}
                  />
                ) : field.type && field.type === "text" ? (
                  <textarea
                    id={field.id}
                    name={"body[" + field.id + "][" + field.type + "][value]"}
                    onChange={handleInputData({
                      id: field.id,
                      name: "body[" + field.id + "][text]",
                      type: field.type,
                    })}
                    className={className}
                    defaultValue={field.defaultValue ? field.defaultValue : ""}
                    required={true}
                  />
                ) : (
                  <div>NO paragraph type indicated</div>
                )}
                <div
                  id={"form-item-notice-" + field.id}
                  className="form-item-notice"
                ></div>
                {field.extraElement ? field.extraElement : null}
              </div>
              {field.description &&
              field.description["after" as keyof typeof field.description] ? (
                <div
                  className={
                    "field-decription " +
                    field.type +
                    "-decription-after" +
                    " field-decription-" +
                    field.id
                  }
                >
                  {field.description["after" as keyof typeof field.description]}
                </div>
              ) : typeof field.description === "string" ? (
                field.description
              ) : null}
            </React.Fragment>
          );
        })
      : null;

  const paragraphFormId = id + "-paragraph";
  const addText = () => {
    let paragraphElement = document.getElementById(paragraphFormId);
    let newParagraphID = Math.random().toString(36).substring(2);
    let paragraphName = "body[" + newParagraphID + "][text]";

    let newContainerElement = document.createElement("div");

    let paragraphLabelContainer = document.createElement("div");
    let paragraphLabel = document.createElement("label");
    let paragraphRemoveButtonContainer = document.createElement("span");
    let paragraphRemoveButtonToggle = document.createElement("input");
    let paragraphRemoveButtonConfirmContainer = document.createElement("div");
    let paragraphRemoveButtonConfirm = document.createElement("input");
    paragraphLabel.setAttribute("for", newParagraphID);
    paragraphLabel.innerText = "Add Text";
    paragraphRemoveButtonContainer.setAttribute("class", "jsstyler toggle");
    paragraphRemoveButtonToggle.setAttribute(
      "id",
      "delete-paragraph-" + newParagraphID
    );
    paragraphRemoveButtonToggle.setAttribute("type", "button");
    paragraphRemoveButtonToggle.setAttribute("value", "remove");
    paragraphRemoveButtonToggle.onclick = jsStyler();
    paragraphRemoveButtonConfirmContainer.setAttribute(
      "jsstyler-toggle",
      "delete-paragraph-" + newParagraphID
    );
    paragraphRemoveButtonConfirm.setAttribute("type", "button");
    paragraphRemoveButtonConfirm.setAttribute("value", "Confirm Delete");
    paragraphRemoveButtonConfirm.onclick = deleteParagraphFromBody;

    paragraphRemoveButtonConfirmContainer.appendChild(
      paragraphRemoveButtonConfirm
    );
    paragraphRemoveButtonContainer.appendChild(paragraphRemoveButtonToggle);
    paragraphRemoveButtonContainer.appendChild(
      paragraphRemoveButtonConfirmContainer
    );
    paragraphLabelContainer.appendChild(paragraphLabel);
    paragraphLabelContainer.appendChild(paragraphRemoveButtonContainer);

    let noticeContainer = document.createElement("div");
    noticeContainer.setAttribute("id", "form-item-notice-" + newParagraphID);
    noticeContainer.setAttribute("class", "form-item-notice");

    let textElement = document.createElement("textarea");
    textElement.setAttribute("id", newParagraphID);
    textElement.setAttribute("name", paragraphName + "[value]");
    textElement.setAttribute("class", "form-input");
    textElement.setAttribute("required", "");
    textElement.onchange = handleInputData({
      id: newParagraphID,
      name: paragraphName,
      type: "text",
    });
    newContainerElement.appendChild(paragraphLabelContainer);
    newContainerElement.appendChild(textElement);
    newContainerElement.appendChild(noticeContainer);
    paragraphElement?.appendChild(newContainerElement);
  };

  const addImage = () => {
    let paragraphElement = document.getElementById(paragraphFormId);
    let newParagraphID = Math.random().toString(36).substring(2);
    let paragraphName = "body[" + newParagraphID + "][text]";

    let newContainerElement = document.createElement("div");

    let paragraphLabelContainer = document.createElement("div");
    let paragraphLabel = document.createElement("label");
    let paragraphRemoveButtonContainer = document.createElement("span");
    let paragraphRemoveButtonToggle = document.createElement("input");
    let paragraphRemoveButtonConfirmContainer = document.createElement("div");
    let paragraphRemoveButtonConfirm = document.createElement("input");
    paragraphLabel.setAttribute("for", newParagraphID);
    paragraphLabel.innerText = "Add Text";
    paragraphRemoveButtonContainer.setAttribute("class", "jsstyler toggle");
    paragraphRemoveButtonToggle.setAttribute(
      "id",
      "delete-paragraph-" + newParagraphID
    );
    paragraphRemoveButtonToggle.setAttribute("type", "button");
    paragraphRemoveButtonToggle.setAttribute("value", "remove");
    paragraphRemoveButtonToggle.onclick = jsStyler();
    paragraphRemoveButtonConfirmContainer.setAttribute(
      "jsstyler-toggle",
      "delete-paragraph-" + newParagraphID
    );
    paragraphRemoveButtonConfirm.setAttribute("type", "button");
    paragraphRemoveButtonConfirm.setAttribute("value", "Confirm Delete");
    paragraphRemoveButtonConfirm.onclick = deleteParagraphFromBody;

    paragraphRemoveButtonConfirmContainer.appendChild(
      paragraphRemoveButtonConfirm
    );
    paragraphRemoveButtonContainer.appendChild(paragraphRemoveButtonToggle);
    paragraphRemoveButtonContainer.appendChild(
      paragraphRemoveButtonConfirmContainer
    );
    paragraphLabelContainer.appendChild(paragraphLabel);
    paragraphLabelContainer.appendChild(paragraphRemoveButtonContainer);

    let noticeContainer = document.createElement("div");
    noticeContainer.setAttribute("id", "form-item-notice-" + newParagraphID);
    noticeContainer.setAttribute("class", "form-item-notice");

    let textElement = document.createElement("textarea");
    textElement.setAttribute("id", newParagraphID);
    textElement.setAttribute("name", paragraphName + "[value]");
    textElement.setAttribute("class", "form-input");
    textElement.setAttribute("required", "");
    textElement.onchange = handleInputData({
      id: newParagraphID,
      name: paragraphName,
      type: "text",
    });
    newContainerElement.appendChild(paragraphLabelContainer);
    newContainerElement.appendChild(textElement);
    newContainerElement.appendChild(noticeContainer);
    paragraphElement?.appendChild(newContainerElement);
  };

  return (
    <>
      <div id={paragraphFormId}>
        {ParagraphFields && ParagraphFields.length > 0
          ? ParagraphFields.map((field, index) => {
              return field;
            })
          : null}
      </div>
      <input onClick={addText} type="button" value="Add Text" />
      <input onClick={addImage} type="button" value="Add Image" />
      <input type="button" value="Add Video" />
    </>
  );
};
