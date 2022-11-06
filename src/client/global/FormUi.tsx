import React, { useState } from "react";

interface ButtonGroup {
  styling?: string | ButtonGroupStyling;
  clearButton?: number;
  cancelButton?: number;
  submit?: number;
}
interface ButtonGroupStyling {
  group?: string;
  clearButton?: string;
  cancelButton?: string;
  submit?: string;
}
interface Fields {
  type: string; //textfield, textarea, radio, phone, password, checkbox
  weight?: number;
  container?: string;
  label: string;
  id: string;
  styling?: string;
  options?: string[];
}
interface FormProps {
  containers?: object;
  fields: Fields[];
  formData: (data: object) => void;
  buttons?: ButtonGroup;
  labelStyling?: string;
  inputStyling?: string;
  className?: string;
}

/* buttons.styling: string|object = {
	group: string, //styling for button group
	clearButton: string, //styling for clear button 
	cancelButton: string, //styling for cancel button 
	submit: string //styling for submit button 
} */
/* const containers = {
  type: 'detail', // detail, box
  weight: 0, //to order containers
  indent: 0, //units of 'em'
  styling: '', //string value
  fields: [], //collections of fields by containers
}; */

//Sample styling
/* const buttons = {
  //styling: 'mx-auto', //string | option
  styling: {
    group: "mt-5 mx-auto w-fit flex gap-3",
    clearButton: "bg-color-def p-2 capitalize",
    cancelButton: "bg-color-ter p-2 capitalize text-color-def",
    submit: "bg-color-pri p-2 capitalize",
  },
  clearButton: 2,
  submit: 3,
};
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
  const [thisFormData, setThisFormData] = useState({});
  const handleInputData =
    (input: { id: string; type: string }) =>
    (e: { target: { value: string } }) => {
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
      }
      //updating for data state taking previous state and then adding new value to create new object
      setThisFormData((prevState: any) => ({
        ...prevState,
        [input.id]: input.type !== "checkbox" ? value : checkBoxValues,
      }));
    };

  interface ButtonGroupKeys {
    id: string;
    weight: number;
    styling?: string;
  }
  let Buttons: ButtonGroupKeys[] = [];
  if (buttons) {
    Object.keys(buttons).forEach((button: string) => {
      let thisButton = buttons[button as keyof typeof buttons];
      //insert submit button if non-existence
      if (!buttons["submit"]) {
        Buttons.push({
          id: "submit",
          weight: 99,
        });
      }

      if (thisButton && typeof thisButton === "number") {
        if (buttons.styling) {
          let stylingKeys =
            buttons.styling[button as keyof typeof buttons.styling];
          if (stylingKeys) {
            Buttons.push({
              id: button,
              weight: thisButton,
              styling: stylingKeys,
            });
          } else {
            Buttons.push({
              id: button,
              weight: thisButton,
            });
          }
        } else {
          Buttons.push({
            id: button,
            weight: thisButton,
          });
        }
      }
    });
  } else {
    //put submit button ibutton props is absent
    Buttons.push({
      id: "submit",
      weight: 99,
    });
  }
  //console.log("buttons", buttons);
  if (Buttons.length > 0) Buttons.sort((a, b) => a.weight - b.weight);

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
            <div key={index} className="form-item">
              <span
                className={
                  "form-label" + (labelStyling ? " " + inputStyling : "")
                }
              >
                {field.label}
              </span>
              {field.type &&
              (field.type === "password" ||
                field.type === "email" ||
                field.type === "tel" ||
                field.type === "date" ||
                field.type === "file" ||
                field.type === "image" ||
                field.type === "number" ||
                field.type === "time" ||
                field.type === "url" ||
                field.type === "range" ||
                field.type === "color") ? (
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
                  type={field.type}
                />
              ) : field.type && field.type === "textarea" ? (
                <textarea
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
                />
              ) : field.type &&
                (field.type === "radio" || field.type === "checkbox") ? (
                field.options && field.options.length > 0 ? (
                  <span
                    id={field.type + "-container"}
                    className={inputStyling ? " " + inputStyling : ""}
                  >
                    {field.options.map((option, index) => {
                      return (
                        <React.Fragment key={index}>
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
                            value={option.toString()}
                          />
                          <label htmlFor={index.toString()}>
                            {option.toString()}
                          </label>
                        </React.Fragment>
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
                />
              )}
            </div>
          );
        })}
      </div>
    );

    FormFields.push(thisContent);
  });

  //buttons functions
  const clearButton = () => {
    let clearSelector = document.querySelectorAll(".form-input");
    clearSelector.forEach((input: any) => {
      if (input && input.value) input.value = "";
    });
  };
  const cancelButton = () => {
    window.history.back();
  };

  const submit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    formData(thisFormData);
  };

  return (
    <form id="form-ui" className={className}>
      <>
        {FormFields && FormFields.length > 0
          ? FormFields.map((formItem) => {
              return formItem;
            })
          : null}
      </>
      <div
        className={
          "form-button-group" +
          (buttons
            ? buttons.styling && typeof buttons.styling === "object"
              ? buttons.styling["group"]
                ? " " + buttons.styling["group"]
                : ""
              : buttons.styling && typeof buttons.styling === "string"
              ? " " + buttons.styling
              : ""
            : "")
        }
      >
        {Buttons.map((thisButton, index) => {
          return (
            <input
              name="form-button"
              key={index}
              className={thisButton.styling ? thisButton.styling : ""}
              type={thisButton.id === "submit" ? "submit" : "button"}
              value={
                thisButton.id === "clearButton"
                  ? "clear"
                  : thisButton.id === "cancelButton"
                  ? "cancel"
                  : thisButton.id === "submit"
                  ? "submit"
                  : thisButton.id
              }
              style={{ cursor: "pointer" }}
              onClick={eval(thisButton.id)}
            />
          );
        })}
      </div>
    </form>
  );
};
