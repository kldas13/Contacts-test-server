const express = require("express");
const app = express()
const contactRouter = require("./routes/contactsRoute")
const user_route = require("./routes/user")


const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY;
const cors = require("cors");
const { parse } = require("dotenv");

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}))

app.use("/", user_route);

app.use("/contacts", (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization;

    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          return res.status(401).json(err);
        }
        req.user = decoded.data;
        next();
      });
    } else {
      return res.status(401).json({
        status: "Failed",
        message: "Token is missing",
      });
    }
  }else {
    return res.status(403).json({
      status: "Failed",
      message: "Not authenticated user",
    });
  }
});

app.use("/contacts", contactRouter)





module.exports = app
