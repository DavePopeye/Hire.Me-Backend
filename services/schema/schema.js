const { Schema } = require("mongoose");
const mongoose = require("mongoose");
const brcrypt = require("bcryptjs");
const v = require("validator");

const UsersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    image: {
      type: String,
    },
    agencyProfile: {
      type: String,
    },
    linkedinProfile: {
      type: String,
    },
    githubProfile: {
      type: String,
    },
    portfolio: {
      type: String,
    },
    email: {
      type: String,
      required: false,
      lowercase: true,
      unique: true,
      validate: {
        validator: async (value) => {
          if (!v.isEmail(value)) {
            throw new Error("Email is invalid");
          }
        },
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["user", "recruiter"],
      required: true,
    },
    skills: [String],
  },
  { timestamps: true }
);

UsersSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

UsersSchema.statics.findByCredentials = async (email, password) => {
  const user = await UsersModel.findOne({ email });
  if (!user) {
    const err = new Error("User does not exists");
    err.httpStatusCode = 401;
    throw err;
  }
  const isMatch = await brcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Unable to login");
    err.httpStatusCode = 401;
    throw err;
  }
  return user;
};

UsersSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await brcrypt.hash(user.password, 8);
  }

  next();
});

UsersSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

UsersSchema.post("save", function (error, doc, next) {
  if (error.name === "MongoeError" && error.code === 11000) {
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

const UsersModel = mongoose.model("users", UsersSchema);

module.exports = UsersModel;
