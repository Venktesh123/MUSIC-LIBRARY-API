const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGOURL);
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = dbConnect;
