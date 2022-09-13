const visitModel = require("../models/visitSchema");
const userModel = require("../models/userSchema");
const clientModel = require("../models/clientSchema");

const fs = require("fs/promises");
const path = require("path");
const mongoose = require("mongoose");

const readJson = async (filepath) => {
  const file = await fs.readFile(filepath, { encoding: "utf-8" });
  return JSON.parse(file);
};

const getData = async (filename) => {
  const data = await readJson(path.join(__dirname, filename));
  const modifiedElements = data.map((element) => {
    return { ...element, _id: mongoose.Types.ObjectId(element._id) };
  });
  return modifiedElements;
};

const run = async () => {
  const users = await getData("users.json");
  await userModel.insertMany(users);
  const clients = await getData("clients.json");
  await clientModel.insertMany(clients);
  const visits = await getData("visits.json");
  await visitModel.insertMany(visits);
};

run();
