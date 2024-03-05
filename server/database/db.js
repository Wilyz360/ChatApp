// Set up database
let low = require("lowdb");
let FileSync = require("lowdb/adapters/FileSync");
let adapter = new FileSync("./database.json");
let db = low(adapter);

const bcrypt = require("bcrypt"); // for encrypting password

// database functions

// I used async because it takes time (10 roounds) to ecrypt password and need to wait for result
const registerNewUser = async (user) => {
  const { firstname, lastname, email, password } = user;

  const encPassword = await bcrypt.hash(password, 10); // encrypt password

  db.get("users")
    .push({ firstname, lastname, email: email.toLowerCase(), encPassword })
    .write();
};

const findUserByEmail = (email) => {
  const user = db
    .get("users")
    .value()
    .filter((user) => user.email === email);
  //console.log(user.length);
  if (user.length === 1) {
    // return first user that match with the same email
    return user[0];
  } else {
    // return empty string
    return null;
  }
};

// return user with matching email and password
const authUser = async ({ email, password }) => {
  // find user by email
  const user = findUserByEmail(email);

  if (user) {
    // then compare password
    try {
      const passwordMatch = await bcrypt.compare(password, user.encPassword);

      return passwordMatch;
    } catch (error) {
      console.error("Error comparing passwords:", error);
      return false;
    }
  } else {
    return false;
  }
};
exports.registerNewUser = registerNewUser;
exports.findUserByEmail = findUserByEmail;
exports.authUser = authUser;
