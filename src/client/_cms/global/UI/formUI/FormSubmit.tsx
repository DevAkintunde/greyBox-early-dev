import { ServerHandler } from "../../functions/ServerHandler";

interface SubmitData {
  e?: {
    target: { classList: any; disabled: boolean };
    //preventDefault: Function;
  };
  data: FormData;
  endpoint: string;
  method?: string;
  header?: {
    "x-requesttoken"?: string;
    "content-type"?: string;
  };
  callback?: Function; //call function if available with response data
}

export const FormSubmit = async ({
  e,
  data,
  endpoint,
  method,
  header,
  callback,
}: SubmitData) => {
  //e.preventDefault();
  if (e) {
    e.target.disabled = true;
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");
  }
  
  return ServerHandler({
    endpoint: endpoint,
    method: method ? method : "POST",
    headers: header
      ? header
      : {
          "content-type": "multipart/form-data",
        },
    body: data,
  }).then((res) => {
    //console.log("res", res);
    if (res.status !== 200) {
      let submitNotice = document.getElementById("form-actions-notice");
      if (submitNotice)
        submitNotice.textContent = res.statusText
          ? res.statusText
          : "Oops! There was a problem somewhere. Please try again";
      let button: any = document.querySelector("input.submit");
      if (button) {
        if (button.classList && button.classList.contains("bounce"))
          button.classList.remove("bounce");
        if (button["disabled"] && button["disabled"] === true)
          button["disabled"] = false;
      }
      return null;
    } else {
      if (callback) {
        return callback(res);
      }
      return res;
    }
  });
};
