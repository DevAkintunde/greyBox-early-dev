// import loadingImage from '../images/load.gif';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

//animation styles. ripple is default.
const ripple = (
  <div className="lds-ripple text-5xl">
    <div className="border-color-pri/10 border-solid border-r-[40px]"></div>
    <div>Loading...</div>
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
const throbber = (
  <div className="p-3 bg-color-pri w-[40px] h-[40px] mx-auto rounded-full animate-ping">
    <div className="p-1 bg-color-ter/70 w-[10px] h-[10px] mx-auto rounded-full animate-ping" />
  </div>
);

const Loading = (props: {
  animation?: "throbber" | "ripple" | "pulse";
  styling?: string; //custom styling for the loader
  message?: string; //the message content
  timeout?: number; //optional timeOut value
  infinitylyLoad?: boolean; //endlessly load without displaying message by disabling timeout
  instantMessage?: boolean; //ignore timeout and instantly display loaded message
  refresh?: boolean; //refresh boolean for out of Ops async operations
  refreshTrigger?: any;
}) => {
  const location = useLocation();
  let animations: any = {
    ripple: ripple,
    pulse: pulse,
    throbber: throbber,
  };
  let animation =
    props.animation && animations[props.animation]
      ? animations[props.animation]
      : animations["ripple"];

  const styling = props.styling;
  const message = props.message;
  const infinitylyLoad = props.infinitylyLoad;
  let instantMessage = props.instantMessage;
  const refresher = props.refresh;
  const [content, setContent]: any = useState();

  useEffect(() => {
    let isMounted = true;
    const ping = (
      <span className="flex h-3 w-3 relative mx-auto">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-color-pri opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-color-pri"></span>
      </span>
    );
    setContent(<div className="text-center">{animation}</div>);

    if (!infinitylyLoad) {
      if (message && !instantMessage) {
        setTimeout(
          () => {
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
          },
          props.timeout ? props.timeout : 3000
        );
      } else if (!instantMessage) {
        setTimeout(
          () => {
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
          },
          props.timeout ? props.timeout : 3000
        );
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
    infinitylyLoad,
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
