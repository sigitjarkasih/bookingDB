const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Silahkan Input Nama Anda"],
    },

    email: {
      type: String,
      required: [true, "Silahkan Input Email Anda"],
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw Error("Periksa Kembali Email Yang Anda Gunakan");
        }
      },
    },
    role: {
      type: String,
      enum: ["admin", "owner"],
      default: "owner",
    },

    password: {
      type: String,
      required: [true, "Silahkan Input Password Anda"],
      minlength: 8, // minimal 8 password
      trim: true,
    },
    passwordComfirm: {
      type: String,
      trim: true,
      minlength: 8, // minimal 8 password
      required: [true, "Silahkan Input Password Anda Kembali"],
      validate(value) {
        if (!this.password !== this.passwordComfirm) {
          return true;
        }
      },
    },
    tokens: [
      {
        token: { type: String },
      },
    ],
  },

  { timestamps: true }
);
// generate token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "JR", {
    expiresIn: "1 days", //waktu berdasarkan waktu dalam bahasa inggris
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};
// custom json convert
userSchema.method.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.passwordComfirm;
  delete userObject.tokens;

  return userObject;
};

// login cek
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Error("User Tidak DiTemukan");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw Error("Password Anda Gunakan Salah, Periksa Kembali Password Anda");
  }

  return user;
};
// hashing password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  if (user.isModified("passwordComfirm")) {
    user.passwordComfirm = await bcrypt.hash(user.passwordComfirm, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
