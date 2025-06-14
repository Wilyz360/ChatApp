// connect to DB
const moongose = require("mongoose");

exports.connect = () => {
  moongose
    .connect(process.env.MONGODB_URL)
    .then(console.log("DB connected successfully"))
    .catch((error) => {
      console.log("DB connection failed");
      console.log(error);
      process.exit(1);
    });
};
