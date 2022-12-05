//use to format date from to timeago and shorter versions
//format: full/teaser/timeago/undefined

export const dateFormatter = (props: { date?: string; format?: string }) => {
  //use this format to import dates {date: 'date', format:'full'}
  //an empty props with return the current date.
  const date = props && props.date ? props.date : null;
  const format = props && props.format ? props.format : null;
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let formatedDate: string = "";
  let thisDate = new Date(Date.now());
  if (date) {
    thisDate = new Date(date);
  }
  // console.log(thisDate.getMonth().toString());
  // console.log("0" + thisDate.getMonth());
  // console.log(thisDate.getMonth().toString().length);
  if (format && format === "full") {
    formatedDate =
      monthNames[thisDate.getMonth()] +
      " " +
      (thisDate.getDate().toString().length > 1
        ? thisDate.getDate()
        : "0" + thisDate.getDate()) +
      ", " +
      thisDate.getFullYear();
  }
  if (format && format === "teaser") {
    formatedDate =
      monthNames[thisDate.getMonth()].substring(0, 3) +
      " " +
      (thisDate.getDate().toString().length > 1
        ? thisDate.getDate()
        : "0" + thisDate.getDate()) +
      ", " +
      thisDate.getFullYear();
  }
  if (format && format === "timeago") {
    const currentDate = Date.now();
    let thisDateTimeStamp = thisDate.getTime();
    let timeLine;
    if (currentDate > thisDateTimeStamp) {
      timeLine = "past";
    } else {
      timeLine = "future";
    }
    //console.log("currentDate", currentDate);
    //console.log("thisDate", thisDate.getTime());
    const diff = Math.abs((currentDate - thisDateTimeStamp) / 1000); //To seconds
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    if (diff <= 60) {
      //<= 60sec
      let offset = timeLine === "past" ? Math.floor(-diff) : Math.floor(diff);
      let offsetDate = rtf.formatToParts(offset, "second");
      offsetDate.forEach((construct) => {
        formatedDate = formatedDate
          ? formatedDate + " " + construct.value.trim()
          : construct.value.trim();
      });
    } else if (diff <= 3600) {
      //<= 1hr
      let offset =
        timeLine === "past" ? Math.floor(-diff / 60) : Math.floor(diff / 60);
      let offsetDate = rtf.formatToParts(offset, "minute");
      offsetDate.forEach((construct) => {
        formatedDate = formatedDate
          ? formatedDate + " " + construct.value.trim()
          : construct.value.trim();
      });
    } else if (diff <= 86400) {
      //<= 24hrs/day
      let offset =
        timeLine === "past"
          ? Math.floor(-diff / (60 * 60))
          : Math.floor(diff / (60 * 60));
      let offsetDate = rtf.formatToParts(offset, "hour");
      offsetDate.forEach((construct) => {
        formatedDate = formatedDate
          ? formatedDate + " " + construct.value.trim()
          : construct.value.trim();
      });
    } else if (diff < 604800) {
      //<= 1 week
      let offset =
        timeLine === "past"
          ? Math.floor(-diff / (60 * 60 * 24))
          : Math.floor(diff / (60 * 60 * 24));
      let offsetDate = rtf.formatToParts(offset, "day");
      offsetDate.forEach((construct) => {
        formatedDate = formatedDate
          ? formatedDate + " " + construct.value.trim()
          : construct.value.trim();
      });
    } else if (diff < 2419200) {
      //<= 1 month
      let offset =
        timeLine === "past"
          ? Math.floor(-diff / (60 * 60 * 24 * 7))
          : Math.floor(diff / (60 * 60 * 24 * 7));
      let offsetDate = rtf.formatToParts(offset, "week");
      offsetDate.forEach((construct) => {
        formatedDate = formatedDate
          ? formatedDate + " " + construct.value.trim()
          : construct.value.trim();
      });
    } else if (diff < 29030400) {
      //<= 1 year
      let offset =
        timeLine === "past"
          ? Math.floor(-diff / (60 * 60 * 24 * 7 * 4))
          : Math.floor(diff / (60 * 60 * 24 * 7 * 4));
      let offsetDate = rtf.formatToParts(offset, "month");
      offsetDate.forEach((construct) => {
        formatedDate = formatedDate
          ? formatedDate + " " + construct.value.trim()
          : construct.value.trim();
      });
    } else if (diff > 29030400) {
      let offset =
        timeLine === "past"
          ? Math.floor(-diff / (60 * 60 * 24 * 7 * 4 * 12))
          : Math.floor(diff / (60 * 60 * 24 * 7 * 4 * 12));
      let offsetDate = rtf.formatToParts(offset, "year");
      offsetDate.forEach((construct) => {
        formatedDate = formatedDate
          ? formatedDate + " " + construct.value.trim()
          : construct.value.trim();
      });
    }
  } else {
    formatedDate =
      thisDate.getFullYear() +
      "-" +
      ((thisDate.getMonth() + 1).toString().length > 1
        ? thisDate.getMonth() + 1
        : "0" + (thisDate.getMonth() + 1)) +
      "-" +
      (thisDate.getDate().toString().length > 1
        ? thisDate.getDate()
        : "0" + thisDate.getDate());
  }

  return formatedDate;
};
