"use strict";
const mongoose = require("mongoose");
const connectString = "mongodb+srv://huy24112001:huy24112001@cluster0.jip4s.mongodb.net/BE-Project?retryWrites=true&w=majority&appName=Cluster0";

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    if (!true) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Mongodb Connected");
      })
      .catch((err) => console.log("Error:: " + err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
