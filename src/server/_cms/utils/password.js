import bcrypt from "bcryptjs";

const hash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
const compare = (password, hashedPassword) =>
  bcrypt.compareSync(password, hashedPassword);
/* const hash = (password) =>
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, function (err, res) {
      //if (err) throw Error
      console.log("hash: ", res);
      return res;
    });
  });
const compare = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword, function (err, res) {
    //if (err) throw Error;
    return res;
  }); */

export { hash, compare };
