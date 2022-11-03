// Process deletion of db data across tables.
const { logger } = require('../../utils/logger');
const { Op } = require("sequelize");
const Page = require("../../models/contents/StaticPage.model");
const VerifyOTP = require("../../models/VerifyOTP.model");

exports.page = async() => {
  const currentDate = Date.now()
  const pageInBin = await Page.destroy({
     where: {
       markForDeletionBy: {
         [Op.lt]: currentDate,                       
       },
       state: "deleted",
     },
  });
  logger.info('Permanently delete pages sent to Bin!');
}

exports.verifyOTP = async() => {
  const currentDate = Date.now()
  const otpCollection = await VerifyOTP.destroy({
     where: {
       markForDeletionBy: {
         [Op.lt]: currentDate,                       
       },
     },
  });
  logger.info('Expired OTP cleared!');
}