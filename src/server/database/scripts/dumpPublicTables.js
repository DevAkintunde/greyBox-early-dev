import State from "../../models/fields/dbFields/EntityStatus.model";

const modelsDump = async () => {
  // if dev mode.
  try {
    //await Account.sync({ force: true });
    await State.drop();
    logger.info("Tables dumpped!");
    console.log("Tables dumpped!");
  } catch (err) {
    logger.error(err.message);
    console.log(err.message);
  }
};

modelsDump();
