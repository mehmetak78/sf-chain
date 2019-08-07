
const express = require("express");
const Blockchain = require("../blockchain");

const HTTP_PORT = process.env.HTTP_PORT || 3001;

const app = express();

const bc = new Blockchain();

app.get("/blocks",(req, res) => {

});