import { ReactElement } from "react";

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
    attribute: string; //required/visible/checked/empty/select
  };
  dependentController: string[];
  description?: { before: string } | { after: string } | string; // use as field description text
  extraElement?: ReactElement | null; // Extra react component that can be inserted along with each field
}

export const dependentField = (
  fields: Fields[],
  field: any,
  on?: { handleInputData: string | string[] }
) => {
  if (field && field.dependent) {
    let referenceField: any;
    for (let i = 0; i < fields.length; i++) {
      const thisField = fields[i];
      if (thisField["id" as keyof typeof thisField] === field.dependent.id) {
        referenceField = thisField;
        break;
      }
    }
    let returnValue: { [x: string]: string };
    let referenceCheckTrue: boolean;
    if (on && on["handleInputData"]) {
      let referenceCurrentValue = document.querySelector(
        `#form-item-${referenceField.id} input`
      );
      function setAttribute(thisAttribute: string) {
        if (
          on["handleInputData"] === "required" ||
          on["handleInputData"] === "empty"
        ) {
          let dependentFieldHandler: any = document.querySelector(
            `#form-item-${field.id} input`
          );
          if (dependentFieldHandler) {
            referenceCheckTrue =
              referenceCurrentValue?.[
                "value" as keyof typeof referenceCurrentValue
              ] === field.dependent.value
                ? true
                : false;
            if (on["handleInputData"] === "required") {
              if (referenceCheckTrue) {
                dependentFieldHandler?.setAttribute(
                  on["handleInputData"],
                  "true"
                );
              } else {
                dependentFieldHandler &&
                  dependentFieldHandler.hasAttribute(on["handleInputData"]) &&
                  dependentFieldHandler.removeAttribute(on["handleInputData"]);
              }
            } else if (
              on["handleInputData"] === "empty" &&
              referenceCheckTrue
            ) {
              dependentFieldHandler["value"] = "";
            }
          }
        } else if (on["handleInputData"] === "visible") {
          let dependentFieldHandler = document.querySelector(
            `#form-item-container-${field.id}`
          );
          referenceCheckTrue =
            referenceCurrentValue?.[
              "value" as keyof typeof referenceCurrentValue
            ] === field.dependent.value
              ? true
              : false;
          if (referenceCheckTrue) {
            dependentFieldHandler?.classList &&
              dependentFieldHandler?.classList.contains("hidden") &&
              dependentFieldHandler?.classList.remove("hidden");
          } else {
            dependentFieldHandler?.classList.add("hidden");
          }
        } else if (on["handleInputData"] === "checked") {
          let dependentFieldHandler = document.querySelectorAll(
            `#form-item-container-${field.id} input`
          );
          dependentFieldHandler.forEach((inputValue: any) => {
            if (
              inputValue.value &&
              inputValue.value ===
                referenceCurrentValue?.[
                  "value" as keyof typeof referenceCurrentValue
                ]
            ) {
              inputValue?.setAttribute("checked", "true");
            } else {
              inputValue &&
                inputValue.hasAttribute("checked") &&
                inputValue.removeAttribute("checked");
            }
          });
        } else if (on["handleInputData"] === "select") {
          let dependentFieldHandler = document.querySelectorAll(
            `#form-item-container-${field.id} select option`
          );
          dependentFieldHandler.forEach((selectOption: any) => {
            if (
              selectOption.value &&
              selectOption.value ===
                referenceCurrentValue?.[
                  "value" as keyof typeof referenceCurrentValue
                ]
            ) {
              selectOption?.setAttribute("selected", "true");
            } else {
              selectOption &&
                selectOption.hasAttribute("selected") &&
                selectOption.removeAttribute("selected");
            }
          });
        }
      }
      if (typeof field.dependent.attribute === "string") {
        setAttribute(on["handleInputData"]);
      } else {
        on["handleInputData"].forEach((attr: string) => {
          setAttribute(attr);
        });
      }
    } else {
      referenceCheckTrue =
        referenceField.defaultValue === field.dependent.value ? true : false;

      if (referenceCheckTrue) {
        function setAttribute(thisAttribute: string) {
          if (
            thisAttribute === "required" ||
            thisAttribute === "visible" ||
            thisAttribute === "checked" ||
            thisAttribute === "empty"
          ) {
            //uncheck defaultValue if exists
            console.log("field.defaultValue", field);
            if (field.dependent.attribute === "checked") {
              //field.defaultValue = "";
            }
            return "true";
          }
          return "false";
        }
        if (typeof field.dependent.attribute === "string") {
          returnValue = {
            [field.dependent.attribute]: setAttribute(
              field.dependent.attribute
            ),
          };
        } else {
          returnValue = field.dependent.attribute.map((attr: string) => {
            return { attr: setAttribute(attr) };
          });
        }
      }
    }
    return returnValue;
  }
};
