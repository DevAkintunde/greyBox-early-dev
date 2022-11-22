import React, { ReactElement, useEffect, useState } from "react";
import validator from "validator";
import { APP_ADDRESS } from "../../utils/app.config";
import { ImageUi } from "./ImageUi";

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
    value?: number | string | any;
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
      defaultValue.forEach((paragraph: any) => {
        //console.log("paragraphhhh", paragraph);
        if (typeof paragraph.value === "string") {
          importedData.append(
            "body[" + paragraph.id + "][" + paragraph.type + "]",
            paragraph.value
          );
        } else if (
          typeof paragraph.value === "object" &&
          Object.keys(paragraph.value).length > 0
        ) {
          Object.keys(paragraph.value).forEach((key) => {
            importedData.append(
              "body[" + paragraph.id + "][" + paragraph.type + "][" + key + "]",
              paragraph.value[key]
            );
          });
        }
      });
      setInitialParagraphValues(true);
      setFormData(importedData);
    }
  }, [defaultValue, formData, id, initialParagraphValues, setFormData]);

  const handleInputData =
    (paragraphProps: { paragraphID: string; type: string; value?: string }) =>
    (e: { target: { value: string } | any }) => {
      // input value from the form
      let { value } =
        paragraphProps && paragraphProps.type !== "image"
          ? e.target
          : paragraphProps;

      let perParagraphContents = e.target.parentNode.childNodes;
      //console.log("perParagraphContents:", perParagraphContents);
      let allInputs: any[] = [];
      perParagraphContents &&
        perParagraphContents.length > 0 &&
        perParagraphContents.forEach((input: any) => {
          if (
            input &&
            (input.tagName === "INPUT" || input.tagName === "TEXTAREA")
          ) {
            allInputs.push({ name: input.name, value: input.value });
          }
        });
      //console.log("inputs:", allInputs);

      //process validation
      /* let errorInsert = document.getElementById(
        "form-item-notice-" + paragraphProps.type
      );
      if (paragraphProps.type === "text" && validator.isEmpty(value)) {
        if (errorInsert) errorInsert.textContent = "Add content to field";
        return;
      } else if (paragraphProps.type === "video" && validator.isEmpty(value)) {
        if (errorInsert) errorInsert.textContent = "Add content to field";
        return;
      }
      if (errorInsert && errorInsert.textContent) errorInsert.textContent = ""; */

      //falsify disabled attribute on submit
      let submitButton: any = document.querySelector("input[type=submit]");
      if (submitButton && submitButton["disabled"])
        submitButton["disabled"] = false;
      // console.log(submitButton);

      //updating for data state taking previous state and then adding new values
      //delete form's field key once field is re-emptied
      let importedData: FormData = formData;
      if (allInputs.length > 0) {
        allInputs.forEach((input) => {
          console.log("input this", input);
          if (input.value) {
            importedData.set(input.name, input.value);
          } else if (!input.value && importedData.has(input.name)) {
            importedData.delete(input.name);
          }
        });
      }
      setFormData(importedData);
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
                id={field.id}
                className={
                  "paragraph-form-item form-item form-item-" + field.type
                }
              >
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
                {field.type && field.type === "image" ? (
                  <>
                    {/* <label htmlFor={field.id + "-" + field.type + "-image"}>Image</label> */}
                    <ImageUi
                      id={field.id + "-" + field.type + "-image"}
                      name={"body[" + field.id + "][value]"}
                      defaultValue={field && field.value ? field.value : null}
                      formData={formData}
                      handleInputData={handleInputData({
                        paragraphID: field.id,
                        type: field.type,
                      })}
                      required={true}
                    />
                  </>
                ) : field.type && field.type === "video" ? (
                  <>
                    <label htmlFor={"title"}>Title</label>
                    <input
                      type="text"
                      id={field.id + "-" + field.type + "-title"}
                      name={"body[" + field.id + "][" + field.type + "][title]"}
                      onChange={handleInputData({
                        paragraphID: field.id,
                        type: field.type,
                        //weight: index,
                      })}
                      className={className}
                      defaultValue={
                        field.value && field.value.title
                          ? field.value.title
                          : ""
                      }
                      required={true}
                    />
                    <label htmlFor={"source"}>Source</label>
                    <input
                      type="text"
                      id={field.id + "-" + field.type + "-source"}
                      name={
                        "body[" + field.id + "][" + field.type + "][source]"
                      }
                      onChange={handleInputData({
                        paragraphID: field.id,
                        type: field.type,
                      })}
                      className={className}
                      defaultValue={
                        field.value && field.value.source
                          ? field.value.source
                          : ""
                      }
                      required={true}
                    />
                    <label htmlFor={"path"}>Video Url</label>
                    <input
                      type="text"
                      id={field.id + "-" + field.type + "-path"}
                      name={"body[" + field.id + "][" + field.type + "][path]"}
                      onChange={handleInputData({
                        paragraphID: field.id,
                        type: field.type,
                        //weight: index,
                      })}
                      className={className}
                      defaultValue={
                        field.value && field.value.path ? field.value.path : ""
                      }
                      required={true}
                    />
                  </>
                ) : field.type && field.type === "text" ? (
                  <>
                    <label htmlFor={field.id + "-" + field.type + "-text"}>
                      Text
                    </label>
                    <textarea
                      id={field.id + "-" + field.type + "-text"}
                      name={"body[" + field.id + "][value]"}
                      onChange={handleInputData({
                        paragraphID: field.id,
                        type: field.type,
                        //weight: index,
                      })}
                      className={className}
                      defaultValue={field.value ? field.value : ""}
                      required={true}
                    />{" "}
                  </>
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
    console.log("add text clicked");
    console.log("paragraphFormId", paragraphFormId);
    let paragraphElement = document.getElementById(paragraphFormId);
    /* <textarea
          id={field.id}
          name={field.id}
          onChange={onChangeAction}
          className={
            "form-input" +
            (field.styling ? " " + field.styling : "") +
            (inputStyling ? " " + inputStyling : "")
          }
          defaultValue={field.value ? field.value : ""}
          required={field.required ? true : false}
        /> */
    let newContainerElement = document.createElement("div");
    let textElement = document.createElement("textarea");
    textElement.setAttribute("id", id);
    textElement.setAttribute("name", "text");
    //textElement.setAttribute(onchange, { onChangeAction });
    textElement.setAttribute("class", "text");
    textElement.setAttribute("required", "");
    //textElement.onchange = onChangeAction;
    newContainerElement.appendChild(textElement);
    paragraphElement?.appendChild(newContainerElement);
  };
  return (
    <div id={paragraphFormId}>
      <>
        {ParagraphFields && ParagraphFields.length > 0
          ? ParagraphFields.map((field, index) => {
              return field;
            })
          : null}
      </>
      <input onClick={addText} type="button" value="Add Text" />
      <input type="button" value="Add Image" />
      <input type="button" value="Add Video" />
    </div>
  );
};
