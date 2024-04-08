const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../Models/usersModel");

module.exports = async(req, res, next) => {
  try {
    const token= req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded; // eslint-disable-line no-param-reassign
    const user = await User.findById(decoded.userId)
    console.log(req.userData);

    if (!user) {
      return res.status(401).send({ message: "User does not exist" });
    }

    req.userData = user;
    
    next();
  } catch (error) {
    return res.status(401).send({ message: "Token invalido" });
  }
 
};