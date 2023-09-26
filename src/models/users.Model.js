import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const userCollection = "users";

const cartSchema = new mongoose.Schema(
  {
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
      require: true,
    },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "premium", "admin"],
    required: true,
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  documents: {
    type: Object,
  },
  doctype: {
    type: Object,
  },
  status: {
    type: Boolean,
  },
  last_connection: {
    type: Date,
    default: Date.now(),
  },
});
mongoose.set("strictQuery", false);

userSchema.plugin(mongoosePaginate);

//export const userModel = mongoose.model(userCollection, userSchema);
export default { userCollection, userSchema };
