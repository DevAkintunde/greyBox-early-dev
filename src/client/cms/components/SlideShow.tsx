import React, { useEffect, useState } from "react";

interface Imported {
  content: any;
  caption?: string;
  navigator?: boolean;
  duration?: number;
}
export const SlideShow = ({
  content,
  caption,
  navigator,
  duration,
}: Imported) => {
  const [onDisplay, setOnDisplay] = useState({
    data: content[0],
    index: 0,
  });
  const [slideTrigger, setSlideTrigger] = useState({
    direction: "",
    trigger: "",
  });

  useEffect(() => {
    let isMounted = true;

    type NewDisplay = { data: object; index: number };
    function newDisplay(prev: NewDisplay) {
      let indexer =
        slideTrigger.direction === "previous"
          ? prev.index - 1 < 0
            ? content.length - prev.index - 1
            : prev.index - 1
          : prev.index + 2 > content.length
          ? 0
          : prev.index + 1;
      let newSlide = {
        data: content[indexer],
        index: indexer,
      };
      return newSlide;
    }
    if (isMounted && slideTrigger.direction)
      setOnDisplay((prev) => newDisplay(prev));

    return () => {
      isMounted = false;
    };
  }, [slideTrigger]);

  const previousButton = () => {
    setSlideTrigger({ direction: "previous", trigger: Date.now().toString() });
  };
  const nextButton = () => {
    setSlideTrigger({ direction: "next", trigger: Date.now().toString() });
  };

  return (
    <div className="mx-auto">
      {onDisplay.data}
      <div
        className={
          "relative p-2" + (caption ? " bg-color-pri/60 text-center" : "")
        }
      >
        {caption ? caption : null}
        {navigator ? (
          <div className="absolute z-10 text-3xl grid grid-cols-2 placecontent-evenly w-full bottom-0">
            <input
              className="opacity-20 hover:opacity-100"
              type={"button"}
              value="<"
              onClick={previousButton}
            />
            <input
              className="opacity-20 hover:opacity-100"
              type={"button"}
              value=">"
              onClick={nextButton}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};
