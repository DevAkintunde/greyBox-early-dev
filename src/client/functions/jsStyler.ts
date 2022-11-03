import "./jsStyler.css";

const jsStyler = () => (event: any) => {
  /*  <>
    < jsStyler()/>
  </> */

  let targetID = event.target.id;
  //vary the level where jsstyler class is
  let parent =
    event.target &&
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
    let elementListener = event.target.nodeName.toLowerCase();
    //console.log("elementListener", elementListener);

    //accordion... rework this
    if (parent.classList.contains("accordion")) {
      //parent.classList.add("accordion");
      let groupContainer = parent.parentElement.querySelectorAll("ul");
      for (let i = 0; i < groupContainer.length; i++) {
        const item = groupContainer[i];
        let thisButton = item.parentElement.querySelector(elementListener);
        //console.log(thisButton);
        if (event.target === thisButton) {
          if (item.classList && item.classList.contains("show")) {
            item.classList.remove("show");
          } else if (item && item.classList) {
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
        jsstyler-toggle="toggleElementId"
      ></div>
    </nav> */
    if (parent.classList.contains("toggle")) {
      let targetElement = document.querySelector(
        `[jsstyler-toggle=${targetID}]`
      );
      if (targetElement && targetElement.classList) {
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
