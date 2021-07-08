const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  securePass: { type: String, required: true },
  salt: String,
});

var userSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  uid: { type: String, required: true, unique: true },
  hostel: {
    type: String,
    enum: ["BH1", "BH2", "BH3", "GH", "Test"],
    required: true,
  },
  attendance: [{ date: Date, present: Boolean }],
});

adminSchema
  .virtual("password")
  .get(function () {
    return this._pass;
  })
  .set(function (pass) {
    this._pass = pass;
    this.salt = uuid();
    this.securePass = this.createHashedPassword(pass);
  });

adminSchema.methods = {
  auth: function (pass) {
    return this.createHashedPassword(pass) === this.securePass;
  },
  createHashedPassword: function (pass) {
    if (!pass) return "";
    try {
      return crypto.createHmac("sha256", this.salt).update(pass).digest("hex");
    } catch (e) {
      return "";
    }
  },
};

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Admin, User };
