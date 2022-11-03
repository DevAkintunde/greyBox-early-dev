const cron = require('node-cron');
const dataDeletion = require('./jobs/dataDeletion');

const jobScheduler = () => {
  console.log('Cron just ran after an hour, 1hr.');
  cron.schedule('0 0 1 * *', ()=> {
    dataDeletion.page();
    dataDeletion.verifyOTP();
  });
}

module.exports = {
    jobScheduler,
}