//always returned as timestamp
/* formats
  integer 30 or -30
  string '30' or '-30h' or '-30'
  Note: interval without unit, or with unsupported unit is treated as day.
  Supported units: m (minutes), h (hours), d (days)
 */
const getOffsetTimestamp = (interval) => {
  //stringify interval
  interval = `${interval}`;
  //interval with -ve will be treated as past
  let setTimeInPast = false;
  //console.log("interval: ", interval);
  //console.log("split: ", interval.split("-"));
  if (interval && interval.split("-").length < 3) {
    if (interval.split("-").length !== 1) {
      setTimeInPast = true;
      interval = interval.split("-")[1];
    }
  } else {
    return "'Interval' not in appropriate format";
  }
  //force convert to integer if interval is now stringified number
  if (!isNaN(interval * 1)) interval = interval * 1;

  const currentTimestamp = Date.now();
  const period = {
    m: 1000 * 60, //minute
    h: 1000 * 60 * 60, //hour
    d: 1000 * 60 * 60 * 24, //day
  };
  // intervals may carry any of the units above, or none.
  // interval without unit, or with unsupported unit is treated as day.
  let timestamp;
  if (typeof interval !== "number") {
    const count = interval.length;
    const suffix = interval.substring(count - 1);
    const digit = interval.split(suffix)[0] * 1;
    if (typeof digit === "number") {
      if (["m", "h", "d"].includes(suffix)) {
        timestamp = setTimeInPast
          ? currentTimestamp - digit * period[suffix]
          : currentTimestamp + digit * period[suffix];
      } else {
        timestamp = setTimeInPast
          ? currentTimestamp - digit * period.d
          : currentTimestamp + digit * period.d;
      }
    } else {
      timestamp = setTimeInPast
        ? currentTimestamp - period.d
        : currentTimestamp + period.d;
    }
  } else {
    timestamp = setTimeInPast
      ? currentTimestamp - interval * period.d
      : currentTimestamp + interval * period.d;
  }
  return timestamp;
};

export { getOffsetTimestamp };
