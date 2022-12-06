import React, { ReactElement, useCallback, useEffect, useState } from "react";
import validator from "validator";
import { jsStyler } from "../../../functions/jsStyler";
import { ImageUi } from "./ImageUi";
import { addNewImage } from "./paragraphElements/addNewImage";
import { addNewText } from "./paragraphElements/addNewText";
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
        console.log("defaul", paragraph);
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
      setFormData(importedData);
    }
  }, [defaultValue, formData, id, initialParagraphValues, setFormData]);

  //process handleInputData
  const [processHandleInputData, setProcessHandleInputData]: any = useState();
  useEffect(() => {
    let isMounted = true;
    if (processHandleInputData && isMounted) {
      //halt initialParagraphValues from re-rendering
      setInitialParagraphValues(true);
      let thisHandleData = processHandleInputData;
      setProcessHandleInputData();
      // input value from the form
      let { name, value } =
        thisHandleData.paragraphProps &&
        thisHandleData.paragraphProps.type !== "image"
          ? thisHandleData.e.target
          : thisHandleData.paragraphProps;

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
      console.log("paragraphElements", paragraphElements);
      paragraphElements.forEach((paragraph, index) => {
        if (importedData.has(name)) {
          importedData.set(paragraph.id + "[weight]", index.toString());
        } else if (importedData.has(paragraph.id + "[weight]")) {
          importedData.delete(paragraph.id + "[weight]");
        }
      });
      //export to FormUI
      setFormData(importedData);
    }

    return () => {
      isMounted = false;
    };
  }, [formData, processHandleInputData, setFormData]);

  const handleInputData = useCallback(
    (paragraphProps: {
        name: string;
        id: string;
        type: string;
        value?: string;
      }) =>
      (e: { target: { value: string } | any }) => {
        // input value from the form
        let { id, value } =
          paragraphProps && paragraphProps.type !== "image"
            ? e.target
            : paragraphProps;

        //process validation
        let errorInsert = document.getElementById("form-item-notice-" + id);
        if (paragraphProps.type === "text" && validator.isEmpty(value)) {
          if (errorInsert) errorInsert.textContent = "Add text to field";
        } else if (
          paragraphProps.type === "video" &&
          validator.isEmpty(value)
        ) {
          if (errorInsert) errorInsert.textContent = "Add content to field";
          return;
        }
        if (errorInsert && errorInsert.textContent)
          errorInsert.textContent = "";

        //falsify disabled attribute on submit
        let submitButton: any = document.querySelector("input[type=submit]");
        if (submitButton && submitButton["disabled"])
          submitButton["disabled"] = false;

        //export data for processing to FormUI
        setProcessHandleInputData({
          paragraphProps: paragraphProps,
          e: e,
        });
      },
    []
  );

  //new paragragh body injection holder
  const [bodyConstruct, setBodyConstruct]: any[] = useState([]);

  //set paragraph remover/deleter ID
  const [deleteParagraphFromBody, setDeleteParagraphFromBody]: any = useState();

  /* process imported paragraphs from server when editing entities and sort by weight */
  const [paragraphDefaults, setParagraphDefaults]: any[] = useState([]);
  const [
    constructedInitialParagraphValues,
    setConstructedInitialParagraphValues,
  ] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!constructedInitialParagraphValues) {
      setConstructedInitialParagraphValues(true);
      let importedParagraphDefaults: any[] = defaultValue ? defaultValue : null;
      if (importedParagraphDefaults && importedParagraphDefaults.length > 0) {
        importedParagraphDefaults.sort((a, b): any => a.weight - b.weight);
      }
      let ParagraphFields: any[] =
        importedParagraphDefaults && importedParagraphDefaults.length > 0
          ? importedParagraphDefaults.map(
              (field: DefaultValues, index: number) => {
                return {
                  id: field.id,
                  element: (
                    <div
                      key={index}
                      id={"body[" + field.id + "][" + field.type + "]"}
                      className={
                        "paragraph-form-item form-item form-item-" + field.type
                      }
                    >
                      <div
                        className={
                          "paragraph-label paragraph-label-" + field.id
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
                        <span className="jsstyler toggle">
                          <input
                            id={"delete-paragraph-" + field.id}
                            type="button"
                            value="remove"
                            onClick={jsStyler()}
                          />
                          <div
                            data-jsstyler-target={
                              "delete-paragraph-" + field.id
                            }
                          >
                            <input
                              type="button"
                              value="Confirm Delete"
                              onClick={() =>
                                setDeleteParagraphFromBody(field.id)
                              }
                            />
                          </div>
                        </span>
                      </div>
                      {field.type && field.type === "image" ? (
                        <ImageUi
                          id={"body[" + field.id + "][" + field.type + "]"}
                          name={
                            "body[" + field.id + "][" + field.type + "][image]"
                          }
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
                          name={
                            "body[" + field.id + "][" + field.type + "][video]"
                          }
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
                          name={
                            "body[" + field.id + "][" + field.type + "][value]"
                          }
                          onChange={handleInputData({
                            id: field.id,
                            name: "body[" + field.id + "][text]",
                            type: field.type,
                          })}
                          className={className}
                          defaultValue={
                            field.defaultValue ? field.defaultValue : ""
                          }
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
                  ),
                };
              }
            )
          : [];
      if (ParagraphFields && isMounted) setParagraphDefaults(ParagraphFields);
    }
    return () => {
      isMounted = false;
    };
  }, [
    className,
    constructedInitialParagraphValues,
    defaultValue,
    formData,
    handleInputData,
  ]);

  //process paragraph remover
  useEffect(() => {
    let isMounted = true;
    //console.log("deleteParagraphFromBody ID", deleteParagraphFromBody);
    if (deleteParagraphFromBody && isMounted) {
      let thisID = deleteParagraphFromBody;
      setDeleteParagraphFromBody();
      if (validator.isUUID(thisID)) {
        //delete from DB && remove html element
        let importedBodyConstruct: any[] = [];
        paragraphDefaults.forEach((thisParagraph: any) => {
          if (thisParagraph.id !== thisID)
            importedBodyConstruct.push(thisParagraph);
        });
        setParagraphDefaults(importedBodyConstruct);
      } else {
        //remove html element
        let importedBodyConstruct: any[] = [];
        bodyConstruct.forEach((thisParagraph: any) => {
          if (thisParagraph.id !== thisID)
            importedBodyConstruct.push(thisParagraph);
        });
        setBodyConstruct(importedBodyConstruct);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [bodyConstruct, deleteParagraphFromBody, paragraphDefaults]);

  console.log("bodyConstruct", bodyConstruct);
  //console.log("paragraphDefaults", paragraphDefaults);

  return (
    <>
      <div id={id + "-paragraph"}>
        {paragraphDefaults && paragraphDefaults.length > 0
          ? paragraphDefaults.map((field: any) => {
              return field.element;
            })
          : null}
        {bodyConstruct && bodyConstruct.length > 0
          ? bodyConstruct.map(
              (newParagraph: {
                id: React.Key;
                element:
                  | React.ReactElement<
                      any,
                      string | React.JSXElementConstructor<any>
                    >
                  | React.ReactFragment
                  | React.ReactPortal
                  | null
                  | undefined;
              }) => {
                return (
                  <React.Fragment key={newParagraph.id}>
                    {newParagraph.element}
                  </React.Fragment>
                );
              }
            )
          : null}
      </div>
      <input
        onClick={() =>
          setBodyConstruct((currentBody: any) => [
            ...currentBody,
            addNewText(className, handleInputData, setDeleteParagraphFromBody),
          ])
        }
        type="button"
        value="Add Text"
      />
      <input
        onClick={() =>
          setBodyConstruct((currentBody: any) => [
            ...currentBody,
            addNewImage(handleInputData, setDeleteParagraphFromBody, formData),
          ])
        }
        type="button"
        value="Add Image"
      />
      <input type="button" value="Add Video" />
    </>
  );
};
