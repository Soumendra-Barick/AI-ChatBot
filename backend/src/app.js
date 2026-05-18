const express = require("express");
const path = require("path");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(express.static(path.join(__dirname, "../public")));

app.get("*name",(req,res)=>{
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

module.exports = app;
