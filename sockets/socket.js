const { io } = require("../index");
// Socket messages

const Bands = require("../models/bands");
const bands = new Bands();
const Band = require("../models/band");
bands.addBand(new Band("Queen"));
bands.addBand(new Band("MegaDeth"));
bands.addBand(new Band("Bon Jovi"));
bands.addBand(new Band("Pantera"));

console.log(bands);

io.on("connection", (client) => {
  console.log("Client connected...");

  client.emit("active-bands", bands.getBands());

  client.on("disconnect", () => {
    console.log("Client disconnected");
  });

  client.on("message", (payload) => {
    console.log("Message", payload);

    io.emit("message", { admin: "New message" });
  });

  client.on("vote-band", (payload) => {
    bands.voteBand(payload.id);
    io.emit("active-bands", bands.getBands());
  });

  client.on("add-band", (payload) => {
    bands.addBand(new Band(payload.name));
    io.emit("active-bands", bands.getBands());
  });

  client.on("delete-band", (payload) => {
    bands.deleteBands(payload.id);
    io.emit("active-bands", bands.getBands());
  });
});
