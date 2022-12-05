export const dayOfCurrentWeekDateFormatter = (day) => {
  const days = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thurday: 4,
    friday: 5,
    saturday: 6,
  };
  let dayCased = day.toLowerCase();
  if (days[dayCased] || days[dayCased] === 0) {
    let thisDayDate = new Date(Date.now());
    let thisDay = thisDayDate.getDay();
    let firstDay = new Date(
      thisDayDate.getTime() - 60 * 60 * 24 * thisDay * 1000
    );
    let currentDay = new Date(
      firstDay.getTime() + 60 * 60 * 24 * days[dayCased] * 1000
    );

    return (
      currentDay.getFullYear() +
      "-" +
      ((currentDay.getMonth() + 1).toString().length > 1
        ? currentDay.getMonth() + 1
        : "0" + (currentDay.getMonth() + 1)) +
      "-" +
      (currentDay.getDate().toString().length > 1
        ? currentDay.getDate()
        : "0" + currentDay.getDate())
    );
  } else {
    return "No valid Day of Week provided.";
  }
};
