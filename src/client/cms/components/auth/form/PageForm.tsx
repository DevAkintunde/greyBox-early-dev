import React, { useEffect, useState } from "react";
import { FormUi } from "../../../global/UI/formUI/FormUi";
import { ServerHandler } from "../../../global/functions/ServerHandler";
import { useLocation } from "react-router-dom";
import PageTitle from "../../blocks/PageTitle";
import { FormFields } from "../../../global/UI/formUI/FormFields";

interface ComponentData {
  id: string;
  updateForm?: boolean;
  callback: Function;
  setTitle?: boolean;
}
export const PageForm = ({
  id,
  updateForm,
  callback,
  setTitle,
}: ComponentData) => {
  let location = useLocation();
  let formApiUrl = updateForm
    ? location.pathname
    : location.pathname.split("/update")[0];

  const [fields, setFields]: any = useState();
  const [formPageTitle, setFormPageTitle]: any = useState();
  const [statuses, setStatuses] = useState();

  useEffect(() => {
    let isMounted = true;
    ServerHandler("/field/auth/statuses").then((res) => {
      console.log("this status", res);
      if (res.status === 200 && isMounted) return setStatuses(res.options);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  /* const formFields = {
     //type: null,
     weight: 1,
     //styling: '',
   };
   const paragraphContainer = {
     weight: 2,
     indent: 2,
     //styling: '',
   };
   const containers = {
     paragraphContainer: paragraphContainer,
     fromFields: formFields,
   }; */

  //update form resolver
  useEffect(() => {
    const statusesField = [
      {
        type: "radio",
        weight: 99,
        //container: "formField",
        label: "Status",
        id: "status",
        options: statuses,
      },
    ];
    const formFields = FormFields({ filter: "full", custom: statusesField });
    if (updateForm) {
      ServerHandler(location.pathname.split("/update")[0]).then((res) => {
        if (res.status === 200) {
          console.log(res);
          let checkIfBodyField = false;
          let updatedFields = formFields.map((field: any) => {
            let thisField;
            if (res.data && res.data[field.id] !== undefined) {
              if (field.id !== "body") {
                thisField = {
                  ...field,
                  defaultValue: res.data[field.id],
                };
              } else if (field.id === "body") {
                checkIfBodyField = true;
                if (res.relations.body && res.relations.body.length > 0) {
                  let paragraphImported: any = [];
                  res.relations.body.forEach((paragraph: any) => {
                    paragraphImported.push({
                      type: paragraph.type,
                      weight: paragraph.data.weight,
                      id: paragraph.data.uuid,
                      defaultValue:
                        paragraph.type !== "text"
                          ? {
                              title: paragraph.data.title,
                              [paragraph.type]: paragraph.data[paragraph.type],
                            }
                          : paragraph.data.value,
                    });
                  });
                  thisField = {
                    ...field,
                    type: "paragraph",
                    //container: "fromFields",
                    defaultValue: paragraphImported,
                  };
                } else {
                  return field;
                }
              }
            } else {
              return field;
            }
            return thisField;
          });
          if (
            !checkIfBodyField &&
            res.relations.body &&
            res.relations.body.length > 0
          ) {
            let paragraphImported: any = [];
            res.relations.body.forEach((paragraph: any) => {
              paragraphImported.push({
                type: paragraph.type,
                weight: paragraph.data.weight,
                id: paragraph.data.uuid,
                defaultValue:
                  paragraph.type !== "text"
                    ? {
                        title: paragraph.data.title,
                        [paragraph.type]: paragraph.data[paragraph.type],
                      }
                    : paragraph.data.value,
              });
            });
            updatedFields.push({
              type: "paragraph",
              weight: 99,
              //container: "fromFields",
              label: "Body",
              id: "body",
              //name: res.data.body, //paragraph parent ID
              defaultValue: paragraphImported,
            });
          }
          setFields(updatedFields);
          if (setTitle) setFormPageTitle("Update " + res.data.title);
        }
      });
    } else {
      setFields(formFields);
      if (setTitle) setFormPageTitle("Create a page");
    }
    return () => {};
  }, [formApiUrl, location.pathname, setTitle, statuses, updateForm]);

  const sendToServer = (data: FormData) => (e: any) => {
    e.preventDefault();
    e.target.disabled = true;
    console.log("data", data);
    for (let [key, val] of data.entries()) {
      console.log("fetchForm", [key, val]);
    }
    if (e.target.classList && !e.target.classList.contains("bounce"))
      e.target.classList.add("bounce");

    ServerHandler({
      endpoint: formApiUrl,
      method: updateForm ? "patch" : "post",
      headers: {
        //accept: "application/json",
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
          /* if (button["disabled"] && button["disabled"] === true)
            button["disabled"] = false; */
        }
      } else {
        callback(res);
      }
    });
  };

  let buttons = [
    {
      value: "Upload",
      weight: 1,
      styling: "p-3 mx-auto",
      submit: true,
      action: sendToServer,
    },
  ];

  return (
    <>
      {setTitle ? <PageTitle title={formPageTitle} /> : null}
      <FormUi
        //containers={containers}
        id={id}
        fields={fields}
        buttons={buttons}
      />
    </>
  );
};
