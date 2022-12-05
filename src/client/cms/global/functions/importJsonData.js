import ngGeography from "../jsonData/ngGeography.json";

//note to always have 'name' key on import json data if export to FormUi
export const importJsonData = (id) => {
  if (id === "ngGeography") {
    let data = ngGeography;
    return data;
  } else {
    return null;
  }
};
