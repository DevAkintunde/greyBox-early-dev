const markForDeletion = (interval) => {
  const currentTimestamp = Date.now();
  const m = 1000 * 60; //minute
  const h = m * 60; //hour
  const d = h * 24; //day
  // intervals may carry any of the units above, or none.
  // interval without unit, or with unsupported unit is treated as day.
  let deletionDate;
  if (typeof interval !== "number") {
    const count = interval.length;
    const suffix = interval.substring(count - 1);
    const digit = interval.split(suffix)[0] * 1;
    if (typeof digit === "number") {
      if (["m", "h", "d"].includes(suffix)) {
        deletionDate = currentTimestamp + digit * [suffix];
      } else {
        deletionDate = currentTimestamp + digit * d;
      }
    } else {
      deletionDate = currentTimestamp + d;
    }
  } else {
    deletionDate = currentTimestamp + interval * d;
  }
  return deletionDate;
};

export { markForDeletion };
