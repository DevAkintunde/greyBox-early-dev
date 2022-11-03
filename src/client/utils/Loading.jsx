// import loadingImage from '../images/load.gif';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

//animation styles. Ripple is default.
const ripple = (
  <div className="lds-ripple">
    <div className="border-color-pri/10 border-solid border-r-[40px]"></div>
    <div></div>
  </div>
);
const pulse = (
  <div className="border shadow rounded-md p-4 m-2 bg-color-sec/60 max-w-sm w-full mx-auto">
    <div className="animate-pulse flex space-x-4 items-center">
      <div className="rounded-lg bg-slate-200 h-10 w-10"></div>
      <div className="flex-1 space-y-6 py-1">
        <div className="h-2 bg-slate-200 rounded"></div>
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 bg-slate-200 rounded col-span-2"></div>
            <div className="h-2 bg-slate-200 rounded col-span-1"></div>
          </div>
          <div className="h-2 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

const Loading = (props) => {
  const location = useLocation();
  let animation = props.animation === "pulse" ? pulse : ripple;

  //custom styling for the loader
  const styling = props.styling;
  //the message content
  const message = props.message;
  //endlessly load without displaying message by disabling timeout
  //boolean
  const disableTimeout = props.disableTimeout;
  //ignore timeout and instantly display loaded message
  //boolean
  let instantMessage = props.instantMessage;
  //refresh boolean for out of Ops async operations
  const refresher = props.refresh;
  const [content, setContent] = useState();

  useEffect(() => {
    let isMounted = true;
    const ping = (
      <span className="flex h-3 w-3 relative mx-auto">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-color-pri opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-color-pri"></span>
      </span>
    );
    setContent(<div className="text-center">{animation}</div>);

    if (!disableTimeout) {
      if (message && !instantMessage) {
        setTimeout(() => {
          if (isMounted) {
            setContent(
              <div id="loadingMessage" className="m-2 p-6">
                {ping}
                {message}
                {refresher ? (
                  <div className="text-center mt-4">
                    <input
                      type="button"
                      id="triggerAsyncRefresh"
                      value="Refresh"
                      className="uk-button uk-button-secondary"
                      onClick={props.refreshTrigger}
                    />
                  </div>
                ) : null}
              </div>
            );
          }
        }, 30000);
      } else if (!instantMessage) {
        setTimeout(() => {
          if (isMounted) {
            setContent(
              <div id="loadingMessage" className="m-2 p-6">
                {ping}
                {
                  "Oops! Taking longer than expected. Please refresh this page to try again"
                }
                {refresher ? (
                  <div className="text-center mt-4">
                    <input
                      type="button"
                      id="triggerAsyncRefresh"
                      value="Refresh"
                      className=""
                      onClick={props.refreshTrigger}
                    />
                  </div>
                ) : null}
              </div>
            );
          }
        }, 40000);
      } else {
        setContent(
          <div id="loadingMessage" className="m-2 p-6">
            {ping}
            {message}
            {refresher ? (
              <div className="text-center mt-4">
                <input
                  type="button"
                  id="triggerAsyncRefresh"
                  value="Refresh"
                  className="uk-button uk-button-secondary"
                  onClick={props.refreshTrigger}
                />
              </div>
            ) : null}
          </div>
        );
      }
    }

    return () => {
      isMounted = false;
    };
  }, [
    message,
    location.key,
    refresher,
    props.refreshTrigger,
    instantMessage,
    disableTimeout,
    animation,
  ]);

  return (
    <>
      <div
        className={"mx-auto min-h-min" + (styling ? " " + styling : "")}
        style={{ minHeight: "100px" }}
      >
        {content}
      </div>
    </>
  );
};
export default Loading;
