import { jsStyler } from "../../../../functions/jsStyler";

const addNewText: Function = (
  paragraphFormId: string,
  handleInputData: Function,
  deleteParagraphFromBody: any
) => {
  let paragraphElement = document.getElementById(paragraphFormId);
  let newParagraphID = Math.random().toString(36).substring(2);
  let paragraphName = "body[" + newParagraphID + "][text]";

  let newContainerElement = document.createElement("div");
  newContainerElement.setAttribute("id", "body[" + newParagraphID + "][text]");
  newContainerElement.setAttribute(
    "class",
    "paragraph-form-item form-item form-item-text"
  );
  let paragraphLabelContainer = document.createElement("div");
  paragraphLabelContainer.setAttribute(
    "class",
    "paragraph-label paragraph-label-" + newParagraphID
  );
  let paragraphLabel = document.createElement("label");
  let paragraphRemoveButtonContainer = document.createElement("span");
  let paragraphRemoveButtonToggle = document.createElement("input");
  let paragraphRemoveButtonConfirmContainer = document.createElement("div");
  let paragraphRemoveButtonConfirm = document.createElement("input");
  paragraphLabel.setAttribute("for", newParagraphID);
  paragraphLabel.innerText = "Add Text";
  paragraphRemoveButtonContainer.setAttribute("class", "jsstyler toggle");
  paragraphRemoveButtonToggle.setAttribute(
    "id",
    "delete-paragraph-" + newParagraphID
  );
  paragraphRemoveButtonToggle.setAttribute("type", "button");
  paragraphRemoveButtonToggle.setAttribute("value", "remove");
  paragraphRemoveButtonToggle.onclick = jsStyler();
  paragraphRemoveButtonConfirmContainer.setAttribute(
    "jsstyler-toggle",
    "delete-paragraph-" + newParagraphID
  );
  paragraphRemoveButtonConfirm.setAttribute("type", "button");
  paragraphRemoveButtonConfirm.setAttribute("value", "Confirm Delete");
  paragraphRemoveButtonConfirm.onclick = deleteParagraphFromBody;

  paragraphRemoveButtonConfirmContainer.appendChild(
    paragraphRemoveButtonConfirm
  );
  paragraphRemoveButtonContainer.appendChild(paragraphRemoveButtonToggle);
  paragraphRemoveButtonContainer.appendChild(
    paragraphRemoveButtonConfirmContainer
  );
  paragraphLabelContainer.appendChild(paragraphLabel);
  paragraphLabelContainer.appendChild(paragraphRemoveButtonContainer);

  let noticeContainer = document.createElement("div");
  noticeContainer.setAttribute("id", "form-item-notice-" + newParagraphID);
  noticeContainer.setAttribute("class", "form-item-notice");

  let textElement = document.createElement("textarea");
  textElement.setAttribute("id", newParagraphID);
  textElement.setAttribute("name", paragraphName + "[value]");
  textElement.setAttribute("class", "form-input");
  textElement.setAttribute("required", "");
  textElement.onchange = handleInputData({
    id: newParagraphID,
    name: paragraphName,
    type: "text",
  });
  newContainerElement.appendChild(paragraphLabelContainer);
  newContainerElement.appendChild(textElement);
  newContainerElement.appendChild(noticeContainer);
  paragraphElement?.appendChild(newContainerElement);
};

export { addNewText };
