const jwt = require("jsonwebtoken");
const UsersModel = require("../schema/schema");
const { verifyJWT } = require("../authTools/authTools");

const authorize = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await verifyJWT(token);
    console.log("TOKEN ", decoded);
    const user = await UsersModel.findById(decoded._id);
    console.log(user);

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log("ERROr", e);
    const err = new Error("Please authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

const userOnly = (req, res, next) => {
  if (req.user.role === "user") next();
  const err = new Error("Please authenticate");
  err.httpStatusCode = 401;
  next(err);
};

const recruiterOnly = (req, res, next) => {
  if (req.user.role === "recruiter") {
    next();
  } else {
    const err = new Error("Please authenticate");
    err.httpStatusCode = 401;
    next(err);
  }
};

module.exports = { authorize, userOnly, recruiterOnly };
