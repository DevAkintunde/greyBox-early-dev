import React, { useState, useEffect } from "react";
import { ServerHandler } from "../../global/functions/ServerHandler";

type ToPreview = (a: any) => void;
export const StoryDevBlock = (props: any) => {
  let toPreview: ToPreview = props.toPreview;
  const [summary, setSummary] = useState(<div>Story & Film Development</div>);

  const [server, setServer] = useState();

  useEffect(() => {
    let isMounted = true;

    ServerHandler({
      endpoint: "pages/about",
      method: "patch",
      headers: {
        accept: "application/vnd.api+json",
        "content-type": "application/vnd.api+json",
        "x-requestapp": "react-app",
      },
    }).then((res) => {
      setServer(res);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  console.log(server);

  return (
    <section className="w-3/4 ml-auto my-4">
      <span
        onClick={() => toPreview(summary)}
        className="cursor-pointer bg-color-ter p-2 text-color-def text-right text-xl float-right -mb-5 z-10 inline-block"
      >
        Story & Film
      </span>
      <div
        onClick={() => toPreview(summary)}
        className="cursor-pointer bg-color-ter/80 p-2 pt-0 text-color-def first-letter:text-5xl text-center text-xl clear-both"
      >
        Development
      </div>
    </section>
  );
};
