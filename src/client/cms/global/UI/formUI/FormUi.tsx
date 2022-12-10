import React, { ReactElement, useEffect, useState } from "react";
import validator from "validator";
import { APP_ADDRESS } from "../../../utils/app.config";
import { dependentField } from "./dependentFieldFunction";
import { ImageUi } from "./fieldUI/ImageUi";
import { ParagraphUI } from "./fieldUI/ParagraphUI";

interface FormButtons {
  value?: string;
  weight?: number;
  styling?: string;
  submit?: boolean;
  action: Function;
}
/* const buttons = [
  { value: "Save as draft", weight: 3,  action: () => {} },
  { value: "update", weight: 3, styling: 'p-3 mx-auto', submit: true, action: () => { } }
]; */

interface Fields {
  type: string; //textfield, textarea, radio, phone, password, checkbox
  weight?: number;
  container?: string;
  label: string;
  id: string;
  required?: boolean; //yet to be implemented
  defaultValue?: number | string | any;
  styling?: string;
  options?: string[] | object[];
  dependent?: {
    id: string; //referenced controller field
    value: any; //value of controller field
    attribute: string | string[]; //required/visible/checked/empty/select
  };
  dependentController?: string[];
  description?: { before: string } | { after: string } | string; // use as field description text
  extraElement?: ReactElement | null; // Extra react component that can be inserted along with each field
}
//radio, checkbox and select should be constructed with the options key as array
// either as array strings or array objects. when using objects, 'key|value' keys must always be available
//{"form-item-notice-" + field.id} can be used as per field error or extra description insert

interface FormProps {
  id: string;
  containers?: object;
  fields: Fields[];
  formData?: Function; //this is ignored when there's a button on the form
  buttons?: FormButtons[]; //either buttons or formData should be available to retrieve data
  labelStyling?: string;
  inputStyling?: string;
  className?: string;
  nested?: boolean;
}

/* const buttons = [
  { value: "Save as draft", weight: 3,  action: () => {} },
  { value: "update", weight: 3, styling: 'p-3 mx-auto', submit: true, action: () => { } }
]; */
/* const containers = {
  type: 'detail', // detail, box
  weight: 0, //to order containers
  indent: 0, //units of 'em'
  styling: '', //string value
  fields: [], //collections of fields by containers
}; */

//Sample styling
/*
const labelStyling = "ml-5 text-xl border-b-4 border-color-sec";
const inputStyling = "px-2 rounded-full block w-full"; */

//typical fields
/* {
      type: "text",
      weight: 5,
      id: "alias",
      label: "Alias",
      dependent: {
        id: 'autoAlias',
        value: 'true'
        attribute: required/visible/checked/empty
      }
    } */

export const FormUi = ({
  id,
  containers,
  fields,
  formData,
  buttons,
  labelStyling,
  inputStyling,
  className,
  nested,
}: FormProps) => {
  const [thisFormData, setThisFormData]: FormData | any = useState();
  //dependent fields processor

  //re-render initial form field values if form default changes...
  //like on entity edit form where field values may be imported from server.
  const [rerenderInitialValues, setRerenderInitialValues]: boolean | any =
    useState();

  //set initial form values
  useEffect(() => {
    if (!thisFormData || rerenderInitialValues) {
      setRerenderInitialValues();
      if (fields && fields.length > 0) {
        let importedData: FormData = new FormData();
        fields.forEach((field, index) => {
          // check per dependency condition on another field
          //dependentCondition = { attribute: boolean.toString() }
          /* let dependentCondition: any = field["dependent" as keyof typeof field]
            ? dependentField(fields, field, "defaultValue")
            : null; */
          // check If a Dependent field
          field["dependent" as keyof typeof field] &&
            fields.forEach((checkController) => {
              if (
                field.dependent &&
                field.dependent.id &&
                field.dependent.id === checkController.id
              )
                if (!checkController.dependentController) {
                  checkController.dependentController = [field.id];
                } else if (
                  !checkController.dependentController.includes(field.id)
                ) {
                  checkController.dependentController.push(field.id);
                }
            });

          if (field.defaultValue) {
            if (
              field.type !== "file" &&
              field.type !== "image" &&
              field.type !== "paragraph"
            ) {
              importedData.append(field.id, field.defaultValue);
            } else if (field.type === "image") {
              if (typeof field.defaultValue === "string") {
                importedData.append(field.id, field.defaultValue);
              } else {
                if (field.defaultValue.uuid)
                  importedData.append(
                    field.id + "[image]",
                    field.defaultValue.uuid
                  );
                if (field.defaultValue.title)
                  importedData.append(
                    field.id + "[title]",
                    field.defaultValue.title
                  );
              }
            } else {
              //importedData.append(field.id, field.defaultValue);
            }
          }
        });
        setThisFormData(importedData);
      } else {
        setThisFormData(new FormData());
      }
    }
  }, [fields, rerenderInitialValues, thisFormData]);
  //monitor field changes
  useEffect(() => {
    let isMounted = true;
    if (isMounted) setRerenderInitialValues(true);
    return () => {
      isMounted = false;
    };
  }, [fields]);

  const handleInputData =
    (input: {
      name: string;
      id: string;
      type: string;
      value?: string;
      dependentController?: string[];
    }) =>
    (e: { target: { value: string } | any }) => {
      //console.log("input", input);
      // input value from the form
      let { value } = input && input.type !== "image" ? e.target : input;
      //e && e.target ? e.target : input && input.value ? input.value : null;

      //process validation
      let errorInsert = document.getElementById(
        "form-item-notice-" + input.type
      );
      if (input.type === "email" && !validator.isEmail(value)) {
        if (errorInsert) errorInsert.textContent = "Provide a valid email";
        return;
      } else if (input.type === "date" && !validator.isDate(value)) {
        if (errorInsert) errorInsert.textContent = "Provide a valid date";
        return;
      } else if (input.type === "tel" && !validator.isMobilePhone(value)) {
        if (errorInsert)
          errorInsert.textContent = "Provide a valid phone number";
        return;
      } else if (input.type === "number" && !validator.isInt(value)) {
        if (errorInsert) errorInsert.textContent = "Provide a valid number";
        return;
      } else if (input.type === "url" && !validator.isURL(value)) {
        if (errorInsert) errorInsert.textContent = "Provide a valid url";
        return;
      } else if (input.type === "color" && !validator.isRgbColor(value)) {
        if (errorInsert) errorInsert.textContent = "Provide a valid color";
        return;
      }
      if (errorInsert && errorInsert.textContent) errorInsert.textContent = "";

      //falsify disabled attribute on submit
      let submitButton: any = document.querySelector("input[type=submit]");
      if (submitButton && submitButton["disabled"])
        submitButton["disabled"] = false;
      // console.log(submitButton);

      if (input.dependentController && input.dependentController.length > 0) {
        fields.forEach((checkDependent) => {
          /* console.log("checkDependent", checkDependent);
          console.log("input.dependentController", input.dependentController); */
          if (
            checkDependent.dependent &&
            checkDependent.dependent.id &&
            input.dependentController?.includes(checkDependent.id)
          ) {
            //console.log("eeeee", e);
            //dependentField(fields, checkDependent, handleInputData, referencedField);
            dependentField(
              fields,
              checkDependent,
              handleInputData,
              e.target.id
            );
          }
        });
      }

      let importedData: FormData = thisFormData;
      let checkBoxValues: string[] | any;
      //check if checkbox
      if (input.type === "checkbox") {
        checkBoxValues = importedData.getAll(input.name);
        if (Object.keys(checkBoxValues).length > 0) {
          importedData.delete(input.name);
          let valueExists = false;
          for (let i = 0; i < checkBoxValues.length; i++) {
            if (checkBoxValues[i] !== value) {
              importedData.append(input.name, checkBoxValues[i]);
            } else if (value) {
              valueExists = true;
            }
          }
          if (!valueExists) importedData.append(input.name, value);
        } else {
          importedData.set(input.name, value);
        }
      } else if (input.type === "file") {
        const thisFile = e.target && e.target.files && e.target.files[0];
        //console.log("thisFile", thisFile);
        //console.log("thisFile", URL.createObjectURL(thisFile));
        let imagePreview: Element | null | any = document.querySelector(
          `#${input.id}-preview`
        );
        if (thisFile) {
          if (imagePreview) {
            let thisFilePreviewUrl = URL.createObjectURL(thisFile);
            imagePreview["src"] = thisFilePreviewUrl;
          }
          importedData.set(input.name, thisFile);
        } else if (importedData.has(input.name)) {
          importedData.delete(input.name);
        }
      } else if (input.type === "boolean") {
        if (
          e.target &&
          e.target["checked"] &&
          (value.toLowerCase() === "true" || value === 1)
        ) {
          importedData.set(input.name, "true");
        } else {
          importedData.set(input.name, "false");
        }
      } else {
        if (value) {
          importedData.set(input.name, value);
        } else if (!value && importedData.has(input.name)) {
          if (input.type === "image") {
            let imageFieldName = input.name.split("[image]")[0];
            if (importedData.has(imageFieldName + "[title]"))
              importedData.delete(imageFieldName + "[title]");
          }
          importedData.delete(input.name);
        }
      }
      setThisFormData(importedData);

      for (let [key, val] of thisFormData.entries()) {
        console.log("thisFormData Looped", { [key]: val });
      }
    };
  //console.log("thisFormData Looped", fields);
  /*   const callbackAction = () => (e: any) => {
    e.preventDefault();
    let fetchForm: any = document.getElementById(id);
    if (fetchForm) {
      return new FormData(fetchForm);
    } else {
      let getFormElement: any = document.querySelector("form");
      if (getFormElement) getFormElement.textContent = "Form ID not attached";
    }
  }; */

  //set a default container for un-containerised fields
  const dEfAuLtCoNtAiNeR = {
    type: null,
    weight: 0,
    //indent: 0,
    //styling: '',
    fields: [],
  };
  let containersWithDefault: any = {
    ...containers,
    dEfAuLtCoNtAiNeR: dEfAuLtCoNtAiNeR,
  };

  //insert fields into containers and sort them by such.
  //Fields are displayed inj order of weight
  fields &&
    fields.length > 0 &&
    fields.forEach((field: Fields) => {
      if (field.container) {
        if (containersWithDefault[field["container"]]) {
          if (!containersWithDefault[field["container"]].fields)
            containersWithDefault[field["container"]] = {
              ...containersWithDefault[field["container"]],
              fields: [],
            };
          containersWithDefault[field["container"]].fields.push(field);
        } else {
          let newContainer = {
            ...dEfAuLtCoNtAiNeR,
            fields: [field],
          };
          containersWithDefault = {
            ...containersWithDefault,
            [field["container"]]: newContainer,
          };
        }
      } else {
        containersWithDefault.dEfAuLtCoNtAiNeR.fields.push(field);
      }
    });

  //submit form button when no button is imported
  const submitForm = (input: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    if (formData) formData(input);
  };
  //form button(s)
  let Buttons: FormButtons[] | any[] = buttons ? buttons : [];
  if (Buttons?.length === 0) {
    Buttons.push({
      value: "Submit",
      weight: 99,
      submit: true,
      action: submitForm,
    });
  }
  //console.log("buttons", buttons);
  if (Buttons.length > 0)
    Buttons.sort(
      (a, b) => a["weight" as keyof typeof a] - b["weight" as keyof typeof a]
    );

  let Containers: object[] | any[] = [];
  Object.keys(containersWithDefault).forEach((id) => {
    if (
      containersWithDefault[id] &&
      containersWithDefault[id].fields &&
      containersWithDefault[id].fields.length > 0
    ) {
      let thisContainer = containersWithDefault[id];
      Containers.push({ ...thisContainer, id: id });
    }
  });
  Containers.sort((a, b) => b.weight - a.weight);
  //console.log("Containers:", Containers);

  let FormFields: object[] = [];
  Containers.forEach((container) => {
    let thisContent = (
      <div
        key={container.id}
        id={container.id}
        style={{
          margin: `0 ${container.indent ? container.indent + "em" : 0}`,
        }}
        className={container.styling ? container.styling : ""}
      >
        {container.fields.map((field: Fields, index: number) => {
          // check per dependency condition on another field
          //dependentCondition = { attribute: boolean.toString() }
          let dependentCondition: any = field["dependent"]
            ? dependentField(fields, field)
            : null;
          /* console.log("dependentCondition", dependentCondition); */
          return (
            <div
              id={"form-item-container-" + field.id}
              className={
                dependentCondition &&
                dependentCondition.visible &&
                dependentCondition.visible !== "true"
                  ? "hidden"
                  : ""
              }
              key={index}
            >
              {field.description &&
              field.description["before" as keyof typeof field.description] ? (
                <div
                  className={
                    "field-description field-description-before " +
                    field.type +
                    "-description-before" +
                    " field-description-" +
                    field.id
                  }
                >
                  {
                    field.description[
                      "before" as keyof typeof field.description
                    ]
                  }
                </div>
              ) : null}
              <div
                id={"form-item-" + field.id}
                className={"form-item form-item-" + field.type}
              >
                <label
                  htmlFor={field.id}
                  className={
                    "form-label" + (labelStyling ? " " + inputStyling : "")
                  }
                >
                  {field.label}
                </label>
                {field.type &&
                (field.type === "password" ||
                  field.type === "email" ||
                  field.type === "tel" ||
                  field.type === "date" ||
                  field.type === "number" ||
                  field.type === "time" ||
                  field.type === "url" ||
                  field.type === "range" ||
                  field.type === "color") ? (
                  <input
                    id={field.id}
                    name={field.id}
                    onChange={handleInputData({
                      id: field.id,
                      name: field.id,
                      type: field.type,
                      dependentController: field.dependentController
                        ? field.dependentController
                        : undefined,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    type={field.type}
                    defaultValue={
                      dependentCondition &&
                      dependentCondition.empty &&
                      dependentCondition.empty === "true"
                        ? ""
                        : field.defaultValue
                        ? field.defaultValue
                        : ""
                    }
                    required={
                      dependentCondition &&
                      dependentCondition.required &&
                      dependentCondition.required === "true"
                        ? true
                        : field.required
                        ? true
                        : false
                    }
                  />
                ) : field.type && field.type === "file" ? (
                  <span
                    className={"file-container " + field.id + "-file-container"}
                  >
                    {field.defaultValue ? (
                      <img
                        id={field.id + "-preview"}
                        src={APP_ADDRESS + "/" + field.defaultValue}
                        alt="preview"
                        style={{ width: "100px" }}
                      />
                    ) : null}
                    <input
                      id={field.id}
                      name={field.id}
                      accept="image/png, image/jpeg"
                      //onChange={imageUpload(field.id + "--preview")}
                      /* onChange={(e) => {
                        console.log(URL.createObjectURL(e.target.files[0]));
                      }} */
                      onChange={handleInputData({
                        id: field.id,
                        name: field.id,
                        type: field.type,
                        dependentController: field.dependentController
                          ? field.dependentController
                          : undefined,
                      })}
                      className={
                        "form-input" +
                        (field.styling ? " " + field.styling : "") +
                        (inputStyling ? " " + inputStyling : "")
                      }
                      type="file"
                      required={field.required ? true : false}
                    />
                  </span>
                ) : field.type && field.type === "image" ? (
                  <ImageUi
                    id={field.id}
                    //name={field.id + "[uuid]"}
                    name={field.id}
                    defaultValue={
                      field.defaultValue ? field.defaultValue : null
                    }
                    formData={thisFormData}
                    handleInputData={handleInputData}
                    required={field.required ? true : false}
                  />
                ) : field.type && field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.id}
                    onChange={handleInputData({
                      id: field.id,
                      name: field.id,
                      type: field.type,
                      dependentController: field.dependentController
                        ? field.dependentController
                        : undefined,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    defaultValue={
                      dependentCondition &&
                      dependentCondition.empty &&
                      dependentCondition.empty === "true"
                        ? ""
                        : field.defaultValue
                        ? field.defaultValue
                        : ""
                    }
                    required={
                      dependentCondition &&
                      dependentCondition.required &&
                      dependentCondition.required === "true"
                        ? true
                        : field.required
                        ? true
                        : false
                    }
                  />
                ) : field.type && field.type === "boolean" ? (
                  field.options && field.options.length > 0 ? (
                    <span
                      id={field.id}
                      className={
                        field.type +
                        "-container" +
                        (inputStyling ? " " + inputStyling : "")
                      }
                    >
                      {field.options.map((option: any, index: number) => {
                        return index < 2 ? (
                          <span className={field.type + "-option"} key={index}>
                            <input
                              name={field.id}
                              id={field.id + option}
                              onChange={handleInputData({
                                id: field.id,
                                name: field.id,
                                type: field.type,
                                dependentController: field.dependentController
                                  ? field.dependentController
                                  : undefined,
                              })}
                              className={
                                "form-input" +
                                (field.styling ? " " + field.styling : "")
                              }
                              type={"radio"}
                              value={index === 0 ? "true" : "false"}
                              defaultChecked={
                                dependentCondition &&
                                dependentCondition.checked &&
                                dependentCondition.checked === "true"
                                  ? true
                                  : field.defaultValue !== undefined &&
                                    field.defaultValue.toString() === "true" &&
                                    index === 0
                                  ? true
                                  : field.defaultValue !== undefined &&
                                    field.defaultValue.toString() === "false" &&
                                    index === 1
                                  ? true
                                  : false
                              }
                              required={
                                dependentCondition &&
                                dependentCondition.required &&
                                dependentCondition.required === "true"
                                  ? true
                                  : field.required && index === 0
                                  ? true
                                  : false
                              }
                            />
                            <label htmlFor={field.id + option}>
                              {option.toString()}
                            </label>
                          </span>
                        ) : null;
                      })}
                    </span>
                  ) : (
                    <span className={field.type + "-option"} key={index}>
                      <input
                        id={field.id}
                        name={field.id}
                        onChange={handleInputData({
                          id: field.id,
                          name: field.id,
                          type: field.type,
                          dependentController: field.dependentController
                            ? field.dependentController
                            : undefined,
                        })}
                        className={
                          "form-input" +
                          (field.styling ? " " + field.styling : "")
                        }
                        type={"checkbox"}
                        value={"True"}
                        defaultChecked={
                          dependentCondition &&
                          dependentCondition.checked &&
                          dependentCondition.checked === "true"
                            ? true
                            : field.defaultValue !== undefined &&
                              field.defaultValue.toString() === "true"
                            ? true
                            : false
                        }
                        required={
                          dependentCondition &&
                          dependentCondition.required &&
                          dependentCondition.required === "true"
                            ? true
                            : field.required && index === 0
                            ? true
                            : false
                        }
                      />
                    </span>
                  )
                ) : field.type && field.type === "paragraph" ? (
                  <ParagraphUI
                    id={field.id}
                    name={field.id}
                    formData={thisFormData}
                    setFormData={setThisFormData}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    defaultValue={field.defaultValue ? field.defaultValue : ""}
                    required={field.required ? true : false}
                  />
                ) : field.type && field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.id}
                    onChange={handleInputData({
                      id: field.id,
                      name: field.id,
                      type: field.type,
                      dependentController: field.dependentController
                        ? field.dependentController
                        : undefined,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    defaultValue={
                      dependentCondition &&
                      dependentCondition.select &&
                      dependentCondition.select === "true"
                        ? field.dependent?.value
                        : field.defaultValue
                        ? field.defaultValue
                        : ""
                    }
                    required={
                      dependentCondition &&
                      dependentCondition.required &&
                      dependentCondition.required === "true"
                        ? true
                        : field.required
                        ? true
                        : false
                    }
                  >
                    {field.options && field.options.length ? (
                      field.options.map((option: string | object, index) => {
                        return (
                          <option
                            key={index}
                            value={
                              typeof option === "string"
                                ? option.toString()
                                : option["key" as keyof typeof option]
                                ? option["key" as keyof typeof option]
                                : undefined
                            }
                          >
                            {typeof option === "string"
                              ? option.toString()
                              : option["value" as keyof typeof option]
                              ? option["value" as keyof typeof option]
                              : undefined}
                          </option>
                        );
                      })
                    ) : (
                      <option value={undefined}>{undefined}</option>
                    )}
                  </select>
                ) : field.type &&
                  (field.type === "radio" || field.type === "checkbox") ? (
                  field.options && field.options.length > 0 ? (
                    <span
                      id={field.id}
                      className={
                        field.type +
                        "-container" +
                        (inputStyling ? " " + inputStyling : "")
                      }
                    >
                      {field.options.map((option: string | object, index) => {
                        return (
                          <span className={field.type + "-option"} key={index}>
                            <input
                              id={field.id + index}
                              name={field.id}
                              onChange={handleInputData({
                                id: field.id,
                                name: field.id,
                                type: field.type,
                                dependentController: field.dependentController
                                  ? field.dependentController
                                  : undefined,
                              })}
                              className={
                                "form-input" +
                                (field.styling ? " " + field.styling : "")
                              }
                              type={field.type}
                              value={
                                typeof option === "string" ||
                                typeof option === "boolean"
                                  ? option
                                  : option["key" as keyof typeof option]
                                  ? option["key" as keyof typeof option]
                                  : undefined
                              }
                              defaultChecked={
                                field.defaultValue &&
                                (typeof option === "string" ||
                                  typeof option === "boolean") &&
                                field.defaultValue === option &&
                                dependentCondition &&
                                dependentCondition.checked &&
                                dependentCondition.checked === "true"
                                  ? true
                                  : (typeof option !== "string" ||
                                      typeof option !== "boolean") &&
                                    option["key" as keyof typeof option] &&
                                    field.defaultValue ===
                                      option["key" as keyof typeof option] &&
                                    dependentCondition &&
                                    dependentCondition.checked &&
                                    dependentCondition.checked === "true"
                                  ? true
                                  : !dependentCondition ||
                                    (dependentCondition &&
                                      !dependentCondition.checked)
                                  ? field.defaultValue &&
                                    (typeof option === "string" ||
                                      typeof option === "boolean")
                                    ? field.defaultValue === option
                                      ? true
                                      : typeof option !== "string" &&
                                        option["key" as keyof typeof option]
                                    : field.defaultValue ===
                                      option["key" as keyof typeof option]
                                    ? true
                                    : false
                                  : false
                              }
                              required={
                                field.required && index === 0 ? true : false
                              }
                            />
                            <label htmlFor={field.id + index}>
                              {typeof option === "string" ||
                              typeof option === "boolean"
                                ? option
                                : option["value" as keyof typeof option]
                                ? option["value" as keyof typeof option]
                                : undefined}
                            </label>
                          </span>
                        );
                      })}
                    </span>
                  ) : null
                ) : (
                  <input
                    name={field.id}
                    onChange={handleInputData({
                      id: field.id,
                      name: field.id,
                      type: field.type,
                      dependentController: field.dependentController
                        ? field.dependentController
                        : undefined,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    type="text"
                    defaultValue={
                      dependentCondition &&
                      dependentCondition.empty &&
                      dependentCondition.empty === "true"
                        ? ""
                        : field.defaultValue
                        ? field.defaultValue
                        : ""
                    }
                    required={
                      dependentCondition &&
                      dependentCondition.required &&
                      dependentCondition.required === "true"
                        ? true
                        : field.required
                        ? true
                        : false
                    }
                  />
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
                    "field-description field-description-after " +
                    field.type +
                    "-description-after" +
                    " field-description-" +
                    field.id
                  }
                >
                  {field.description["after" as keyof typeof field.description]}
                </div>
              ) : typeof field.description === "string" ? (
                <div
                  className={
                    "field-description field-description-after " +
                    field.type +
                    "-description-after" +
                    " field-description-" +
                    field.id
                  }
                >
                  {field.description}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );

    FormFields.push(thisContent);
  });

  /*   if (thisFormData)
    for (let [key, val] of thisFormData.entries()) {
      console.log("default datassss", { [key]: val });
    } */

  let returnOutput = (
    <React.Fragment>
      <>
        {FormFields && FormFields.length > 0
          ? FormFields.map((formItem) => {
              return formItem;
            })
          : null}
      </>
      <div id="form-actions">
        <div id="form-actions-notice" />
        <div id="form-button-group" className="form-button-group">
          {Buttons.map((thisButton, index) => {
            return (
              <input
                name="form-button"
                key={index}
                className={
                  "form-button" +
                  (thisButton.styling ? " " + thisButton.styling : "") +
                  (thisButton.submit ? " submit" : "")
                }
                type={
                  thisButton.submit ||
                  thisButton.value.toLowerCase() === "submit"
                    ? "submit"
                    : "button"
                }
                value={thisButton.value}
                onClick={thisButton.action(thisFormData)}
              />
            );
          })}
        </div>
      </div>
    </React.Fragment>
  );

  //'nested' boolean allows swapping 'form' element indicator for 'div' html element
  //to mitigate Form in Form nesting where possible
  return nested
    ? React.createElement(
        "div",
        {
          id: id,
          className: "form-ui" + (className ? " " + className : ""),
        },
        returnOutput
      )
    : React.createElement(
        "form",
        {
          id: id,
          className: "form-ui" + (className ? " " + className : ""),
          encType: "multipart/form-data",
        },
        returnOutput
      );
};
