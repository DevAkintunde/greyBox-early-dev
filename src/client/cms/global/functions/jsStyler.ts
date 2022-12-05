import "./jsStyler.css";

const jsStyler = () => (event: any) => {
  /*  <>
    < jsStyler()/>
  </> */

  let targetID =
    event && event.target && event.target.id ? event.target.id : null;

  //check limited varying level where jsstyler class might be
  let parent =
    targetID &&
    event.target.parentElement &&
    event.target.parentElement.classList &&
    event.target.parentElement.classList.contains("jsstyler")
      ? event.target.parentElement
      : event.target &&
        event.target.parentElement.parentElement &&
        event.target.parentElement.parentElement.classList &&
        event.target.parentElement.parentElement.classList.contains("jsstyler")
      ? event.target.parentElement.parentElement
      : null;

  if (parent && targetID) {
    //accordion
    /* <nav className="jsstyler accordion">
      <button id="toggleElementId" onClick={jsStyler()}/>
      <div
        data-jsstyler-target="accordionElementId"
      ></div>
    </nav>
    <nav className="jsstyler accordion">
      <button id="toggleElementId" onClick={jsStyler()}/>
      <div
        data-jsstyler-target="accordionElementId"
      ></div>
    </nav>
     */
    if (parent.classList.contains("accordion")) {
      let targetElements = document.querySelectorAll(
        `[data-jsstyler-target=${targetID}]`
      );
      //trigger element
      let triggerListener = event.target.nodeName.toLowerCase();
      for (let i = 0; i < targetElements.length; i++) {
        const item = targetElements[i];

        let thisButton = item.parentElement?.querySelector(triggerListener);
        if (event.target === thisButton) {
          if (item.classList && item.classList.contains("show")) {
            item.classList.remove("show");
          } else if (item.classList) {
            item.classList.add("show");
          }
        } else if (item.classList && item.classList.contains("show")) {
          item.classList.remove("show");
        }
      }
    }

    //toogle
    /* <nav className="jsstyler toggle">
      <button id="toggleElementId" onClick={jsStyler()}/>
      <div
        data-jsstyler-target="toggleElementId"
      ></div>
    </nav> */
    if (parent.classList.contains("toggle")) {
      let targetElement = document.querySelector(
        `[data-jsstyler-target=${targetID}]`
      );
      if (targetElement && targetElement.classList) {
        if (targetElement.classList.contains("jsstyler-hide"))
          targetElement.classList.remove("jsstyler-hide");
        if (targetElement.classList.contains("show")) {
          targetElement.classList.remove("show");
        } else {
          targetElement.classList.add("show");
        }
      }
    }
  }
};
export { jsStyler };
