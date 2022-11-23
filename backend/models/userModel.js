const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birth: {
      type: Date,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    sex: {
      type: Number,
      default: 3,
    },
    // cover: {
    //   type: String,
    //   require: true,
    //   default:
    //     "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    // },
    pic: {
      type: String,
      require: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    email_verified_at: {
      type: Date,
      default: "",
    },
    // valiField: {
    //   type: String,
    //   require: true,
    //   validate: {
    //     validator: (text) => {
    //       return text.length > 0;
    //     },
    //     message: "Empty name is not allowed",
    //   },
    // },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);
module.exports = User;