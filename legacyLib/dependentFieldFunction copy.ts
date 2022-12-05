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

/* let exampleFields = [
  {
    type: "text",
    weight: 2,
    id: "autoAlias",
    label: "Auto Alias",
    defaultValue: "false",
    options: ["yes", "no"],
  },
  {
    type: "radio",
    weight: 5,
    id: "alias",
    label: "Alias",
    dependent: {
      id: "autoAlias",
      value: "false",
      attribute: ["!checked", "required"], //required/visible/checked/empty/select
    },
    options: ["true", "false"],
    //defaultValue: "true",
  },
]; */

export const dependentField = (
  fields: Fields[],
  field: any,
  handleInputData?: any
) => {
  if (
    field &&
    field.dependent &&
    field.dependent.id &&
    field.dependent.attribute
  ) {
    let dependentAttribute: string | string[] = field.dependent.attribute;
    let referenceField: any;
    for (let i = 0; i < fields.length; i++) {
      const thisField = fields[i];
      if (thisField["id" as keyof typeof thisField] === field.dependent.id) {
        referenceField = thisField;
        break;
      }
    }
    if (referenceField) {
      let referenceCheckTrue: boolean;
      if (handleInputData) {
        let referenceCurrentField = document.querySelector(
          `#form-item-${referenceField.id} input`
        );
        let referenceCurrentValue =
          referenceCurrentField?.[
            "value" as keyof typeof referenceCurrentField
          ]?.toString();

        if (
          referenceCurrentField?.[
            "type" as keyof typeof referenceCurrentField
          ] === "checkbox" &&
          !referenceCurrentField![
            "checked" as keyof typeof referenceCurrentField
          ]
        ) {
          referenceCurrentValue = "";
        }
        function setAttribute(thisAttribute: string) {
          let checkInverseAttribute = thisAttribute.startsWith("!");
          let attribute = checkInverseAttribute
            ? thisAttribute.substring(1)
            : thisAttribute;

          if (attribute === "required" || attribute === "empty") {
            let dependentFieldHandler: any = document.querySelector(
              `#form-item-${field.id} input`
            );
            if (dependentFieldHandler) {
              let comparer =
                referenceCurrentValue === field.dependent.value.toString();

              referenceCheckTrue = !checkInverseAttribute
                ? comparer
                  ? true
                  : false
                : comparer
                ? false
                : true;
              if (attribute === "required") {
                if (referenceCheckTrue) {
                  dependentFieldHandler?.setAttribute(attribute, "");
                } else {
                  dependentFieldHandler &&
                    dependentFieldHandler.hasAttribute(attribute) &&
                    dependentFieldHandler.removeAttribute(attribute);
                }
              } else if (attribute === "empty" && referenceCheckTrue) {
                dependentFieldHandler["value"] = "";
                let handleInputDataValue = "";
                handleInputData({
                  name: field.id,
                  id: field.id,
                  type: field.type,
                  value: handleInputDataValue,
                })({
                  target: {
                    value: handleInputDataValue,
                  },
                });
              }
            }
          } else if (attribute === "visible") {
            let dependentFieldHandler = document.querySelector(
              `#form-item-container-${field.id}`
            );
            let comparer =
              referenceCurrentValue === field.dependent.value.toString();
            referenceCheckTrue = !checkInverseAttribute
              ? comparer
                ? true
                : false
              : comparer
              ? false
              : true;

            if (referenceCheckTrue) {
              dependentFieldHandler?.classList &&
                dependentFieldHandler?.classList.contains("hidden") &&
                dependentFieldHandler?.classList.remove("hidden");
            } else {
              dependentFieldHandler?.classList.add("hidden");
            }
          } else if (attribute === "checked") {
            let dependentFieldHandler = document.querySelectorAll(
              `#form-item-container-${field.id} input`
            );
            let handleInputDataValue = "";
            dependentFieldHandler.forEach((inputValue: any) => {
              let comparer =
                inputValue.value &&
                inputValue.value.toString() === referenceCurrentValue;
              referenceCheckTrue = !checkInverseAttribute
                ? comparer
                  ? true
                  : false
                : false;

              if (referenceCheckTrue) {
                inputValue?.setAttribute("checked", "");
                handleInputDataValue = inputValue.value;
              } else {
                inputValue &&
                  inputValue.hasAttribute("checked") &&
                  inputValue.removeAttribute("checked");
              }
            });
            handleInputData({
              name: field.id,
              id: field.id,
              type: field.type,
              value: handleInputDataValue,
            })({
              target: {
                value: handleInputDataValue,
              },
            });
          } else if (attribute === "select") {
            let dependentFieldHandler = document.querySelectorAll(
              `#form-item-container-${field.id} select option`
            );
            let handleInputDataValue = "";
            dependentFieldHandler.forEach((selectOption: any) => {
              let comparer =
                selectOption.value &&
                selectOption.value.toString() === referenceCurrentValue;

              referenceCheckTrue = !checkInverseAttribute
                ? comparer
                  ? true
                  : false
                : comparer
                ? false
                : true;

              if (referenceCheckTrue) {
                selectOption?.setAttribute("selected", "");
                handleInputDataValue = selectOption.value;
              } else {
                selectOption &&
                  selectOption.hasAttribute("selected") &&
                  selectOption.removeAttribute("selected");
              }
            });
            handleInputData({
              name: field.id,
              id: field.id,
              type: field.type,
              value: handleInputDataValue,
            })({
              target: {
                value: handleInputDataValue,
              },
            });
          }
        }
        if (typeof dependentAttribute === "string") {
          setAttribute(dependentAttribute);
        } else {
          dependentAttribute.forEach((attr: string) => {
            setAttribute(attr);
          });
        }
      } else {
        let returnValue: { [x: string]: string } = {};
        function setAttribute(thisAttribute: string) {
          let checkInverseAttribute = thisAttribute.startsWith("!");
          //console.log("begins", thisAttribute.substring(1));
          let referenceCurrentValue =
            referenceField && referenceField.defaultValue
              ? referenceField.defaultValue.toString()
              : "";

          if (
            referenceField.type === "checkbox" &&
            referenceCurrentValue !== field.dependent.value.toString()
          ) {
            referenceCurrentValue = "";
          }

          let comparer =
            referenceCurrentValue === field.dependent.value.toString();
          referenceCheckTrue = !checkInverseAttribute
            ? comparer
              ? true
              : false
            : comparer
            ? false
            : true;
          if (referenceCheckTrue) {
            return "true";
          }
          return "false";
        }
        if (typeof dependentAttribute === "string") {
          let attributeLabel = dependentAttribute.startsWith("!")
            ? dependentAttribute.substring(1)
            : dependentAttribute;
          returnValue = {
            [attributeLabel]: setAttribute(dependentAttribute),
          };
          return returnValue;
        } else {
          dependentAttribute.forEach((attr: string) => {
            let attributeLabel = attr.startsWith("!")
              ? attr.substring(1)
              : attr;
            returnValue = {
              ...returnValue,
              [attributeLabel]: setAttribute(attr),
            };
          });
          return returnValue;
        }
      }
    }
  }
};
