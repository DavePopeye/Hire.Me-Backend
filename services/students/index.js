const express = require("express");
const q2m = require("query-to-mongo");
const { authenticate, refreshToken } = require("../authTools/authTools");
const { authorize, userOnly } = require("../middlewares/authorize");
const { verifyJWT } = require("../authTools/authTools");
const UsersModel = require("../schema/schema");
const studentsRouter = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const fs = require("fs-extra");
const path = require("path");
const upload = multer({});
require("dotenv").config();
const algoliasearch = require("algoliasearch");

//algolia client

const client = algoliasearch(
  process.env.ALGOLIA_ID,
  process.env.ALGOLIA_SECRET
);
const index = client.initIndex(process.env.ALGOLIA_INDEX);

//cloud storage

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "some-folder-name",
    format: async (req, file) => "png", // supports promises as well
    public_id: (req, file) => "computed-filename-using-request",
  },
});

const cloudinaryUpload = multer({ storage: storage });

studentsRouter.post(
  "/images/:id",
  cloudinaryUpload.single("image"),
  authorize,
  // userOnly,
  async (req, res, next) => {
    // prendi l'utente con ID = rq.params.id e aggiorna il campo img
    console.log(req.file);
    const user = await UsersModel.findByIdAndUpdate(req.params.id, {
      image: req.file.path,
    });

    res.send(await index.saveObject({ ...user._doc, objectID: req.params.id }));
  }
);

studentsRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);
    const students = await UsersModel.find(query.criteria, query.options.fields)
      .skip(query.options.skip)
      .limit(query.options.limit)
      .sort(query.options.sort);

    res.send(students);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

studentsRouter.get("/bytoken/:token", async (req, res, next) => {
  try {
    const token = req.params.token;
    const { _id } = await verifyJWT(token);
    const student = await UsersModel.findById(_id);
    res.send(student);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

studentsRouter.get("/:_id", async (req, res, next) => {
  try {
    const student = await UsersModel.findById(req.params._id);
    console.log(student);
    res.send(student);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

studentsRouter.post("/signup", async (req, res, next) => {
  try {
    console.log(req.body);
    const newStudent = new UsersModel({ ...req.body, role: "user" });

    const newUser = await newStudent.save();

    delete req.body.password;
    delete req.body.email;

    await index.saveObject({ ...req.body, objectID: newUser._id });
    res.status(201).send({ _id: newUser._id });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

studentsRouter.post("/test", authorize, userOnly, async (req, res, next) => {
  res.send("OK");
});

studentsRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const student = await UsersModel.findByCredentials(email, password);
    const tokens = await authenticate(student);
    res.send(tokens);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

studentsRouter.post("/refreshToken", async (req, res, next) => {
  const oldRefreshToken = req.body.refreshToken;
  if (!oldRefreshToken) {
    const err = new Error("Forbidden");
    err.httpStatusCode = 403;
    next(err);
  } else {
    try {
      const newTokens = await refreshToken(oldRefreshToken);
      res.send(newTokens);
    } catch (error) {
      console.log(error);
      const err = new Error(error);
      err.httpStatusCode = 403;
      next(err);
    }
  }
});

studentsRouter.post("/logout", authorize, async (req, res, next) => {
  try {
    req.user.refreshTokens = req.user.refreshTokens.filter(
      (t) => t.token !== req.body.refreshToken
    );
    await req.user.save();
    res.send();
  } catch (err) {
    next(err);
  }
});

studentsRouter.delete("/:_id", authorize, async (req, res, next) => {
  try {
    await req.user.remove();
    res.send("Deleted");
  } catch (error) {
    next(error);
  }
});

module.exports = studentsRouter;
