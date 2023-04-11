const { io } = require("../index");
// Socket messages

const Bands = require("../models/bands");
const bands = new Bands();
const Band = require("../models/band");
bands.addBand(new Band("Queen"));
bands.addBand(new Band("Death"));
bands.addBand(new Band("Tom Cardi"));
bands.addBand(new Band("Eminem"));

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

  client.on("emit-message", function (payload) {
    client.broadcast.emit("new-message", payload);
  });

  client.on("vote-band", (payload) => {
    bands.voteBand(payload.id);
    io.emit("active-bands", bands.getBands());
  });
});
