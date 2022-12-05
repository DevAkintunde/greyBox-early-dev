import React, { useEffect, useState } from "react";

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
  defaultValue?: number | string;
  styling?: string;
  options?: string[] | object[];
  description?: { before: string } | { after: string } | string; // use as field description text
}
//radio, checkbox and select should be constructed with the options key as array
// either as array strings or array objects. when using objects, 'key|value' keys must always be available
//{"form-item-notice-" + field.id} can be used as per field error or extra description insert

interface FormProps {
  containers?: object;
  fields: Fields[];
  formData?: (data: object) => void; //this is ignored when there's a button on the form
  buttons?: FormButtons[]; //either buttons or formData should be available to retrieve data
  labelStyling?: string;
  inputStyling?: string;
  className?: string;
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

export const FormUi = ({
  containers,
  fields,
  formData,
  buttons,
  labelStyling,
  inputStyling,
  className,
}: FormProps) => {
  //media uploads
  let formMedia: FormData;
  useEffect(() => {
    formMedia = new FormData();
  }, []);

  const imageUpload = (previewId: string) => (e: any) => {
    console.log("we hre");
    console.log("previewId", previewId);
    /* let imageHolder = document.createElement("img");
    imageHolder.src = URL.createObjectURL(e.target.files[0]);
    document.querySelector(previewId).innerHTML = imageHolder; */
    let fieldID = previewId.split("--")[0];
    let { files } = e.target;
    let newFormData;
    console.log("files", files);
    if (files.length > 0) {
      newFormData = {
        ...thisFormData,
        [fieldID]: files,
      };
    } /* else {
      delete thisFormData[fieldID as keyof typeof thisFormData];
      newFormData = thisFormData;
    } */
    //setThisFormData(newFormData);
  };

  //other fields
  const [thisFormData, setThisFormData] = useState({});
  const handleInputData =
    (input: { id: string; type: string }) =>
    (e: { target: { value: string } }) => {
      //falsify disabled attribute on submit
      let submitButton: any = document.querySelector("input[type=submit]");
      if (submitButton && submitButton["disabled"])
        submitButton["disabled"] = false;
      // console.log(submitButton);

      // input value from the form
      const { value } = e.target;
      let checkBoxValues: string[] | any;
      //check if checkbox
      if (input.type === "checkbox") {
        checkBoxValues =
          thisFormData && thisFormData[input.id as keyof typeof thisFormData]
            ? thisFormData[input.id as keyof typeof thisFormData]
            : [];
        if (checkBoxValues.includes(value)) {
          //remove from list
          let filteredValues: string[] = [];
          checkBoxValues.forEach((existingValue: string) => {
            if (existingValue !== value) filteredValues.push(existingValue);
          });
          checkBoxValues = filteredValues;
        } else {
          checkBoxValues.push(value);
        }
        if (checkBoxValues.length === 0) checkBoxValues = undefined;
      }

      let thisValue = input.type !== "checkbox" ? value : checkBoxValues;
      //updating for data state taking previous state and then adding new value
      //delete form's field key once field is re-emptied
      let newFormData;
      if (thisValue.length > 0) {
        newFormData = {
          ...thisFormData,
          [input.id]: input.type !== "checkbox" ? value : checkBoxValues,
        };
      } else {
        delete thisFormData[input.id as keyof typeof thisFormData];
        newFormData = thisFormData;
      }
      setThisFormData(newFormData);
    };
  //console.log("thisFormData", thisFormData);

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

  let formFieldsDefault = {};
  fields.forEach((field: Fields) => {
    if (field.defaultValue)
      formFieldsDefault = {
        ...formFieldsDefault,
        [field.id]: field.defaultValue,
      };
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
  const submitForm = (input: any) => (e: any) => {
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
          return (
            <React.Fragment key={index}>
              {field.description &&
              field.description["before" as keyof typeof field.description] ? (
                <div
                  className={
                    "field-decription " +
                    field.type +
                    "-decription-after" +
                    " field-decription-" +
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
                    name={field.label}
                    onChange={handleInputData({
                      id: field.id,
                      type: field.type,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    type={field.type}
                    defaultValue={field.defaultValue ? field.defaultValue : ""}
                  />
                ) : field.type && field.type === "image" ? (
                  <>
                    <span id={field.id + "-preview"}></span>
                    <input
                      id={field.id}
                      name={field.label}
                      accept="image/png, image/jpeg"
                      onChange={imageUpload(field.id + "--preview")}
                      /* onChange={(e) => {
                        console.log(URL.createObjectURL(e.target.files[0]));
                      }} */
                      /* onChange={handleInputData({
                      id: field.id,
                      type: field.type,
                    })} */
                      className={
                        "form-input" +
                        (field.styling ? " " + field.styling : "") +
                        (inputStyling ? " " + inputStyling : "")
                      }
                      type="file"
                      //formEncType="multipart/form-data"
                      /* defaultValue={
                        field.defaultValue ? field.defaultValue : ""
                      } */
                    />
                  </>
                ) : field.type && field.type === "textarea" ? (
                  <textarea
                    id={field.id}
                    name={field.label}
                    onChange={handleInputData({
                      id: field.id,
                      type: field.type,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    defaultValue={field.defaultValue ? field.defaultValue : ""}
                  />
                ) : field.type && field.type === "select" ? (
                  <select
                    id={field.id}
                    name={field.label}
                    onChange={handleInputData({
                      id: field.id,
                      type: field.type,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    defaultValue={field.defaultValue ? field.defaultValue : ""}
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
                              name={
                                field.type === "radio"
                                  ? field.label
                                  : index.toString()
                              }
                              onChange={handleInputData({
                                id: field.id,
                                type: field.type,
                              })}
                              className={
                                "form-input" +
                                (field.styling ? " " + field.styling : "")
                              }
                              type={field.type}
                              value={
                                typeof option === "string"
                                  ? option.toString()
                                  : option["key" as keyof typeof option]
                                  ? option["key" as keyof typeof option]
                                  : undefined
                              }
                              defaultChecked={
                                field.defaultValue &&
                                (typeof option === "string"
                                  ? option.toString()
                                  : option["key" as keyof typeof option]
                                  ? option["key" as keyof typeof option]
                                  : false)
                                  ? true
                                  : false
                              }
                            />
                            <label htmlFor={index.toString()}>
                              {typeof option === "string"
                                ? option.toString()
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
                    name={field.label}
                    onChange={handleInputData({
                      id: field.id,
                      type: field.type,
                    })}
                    className={
                      "form-input" +
                      (field.styling ? " " + field.styling : "") +
                      (inputStyling ? " " + inputStyling : "")
                    }
                    type="text"
                    defaultValue={field.defaultValue ? field.defaultValue : ""}
                  />
                )}
                <div
                  id={"form-item-notice-" + field.id}
                  className="form-item-notice"
                ></div>
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
        })}
      </div>
    );

    FormFields.push(thisContent);
  });

  return (
    <form id="form-ui" className={className}>
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
                onClick={thisButton.action({
                  ...formFieldsDefault,
                  ...thisFormData,
                })}
              />
            );
          })}
        </div>
      </div>
    </form>
  );
};
