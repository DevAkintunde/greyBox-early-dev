/* cron automated executions */
const cronJobs = (interval) => {
  /* 
      interval is period between repeated cron activity per job 
      calibrated in the cron way: "0 0 1 * *"
  */
  //import app cron jobs here
  if (interval === "*/30 * * * *") {
    //every 30mins  period
  } else if (interval === "0 * * * *") {
    //hourly period
  } else {
    //insert non specific period. This is assumed as 24hrs interval on server
    //also carters for wrong cron config
  }
};
export default cronJobs