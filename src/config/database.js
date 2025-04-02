const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://manishgupta8772:3a1f2RaRt0odPqAs@namastenode.dymbl.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
