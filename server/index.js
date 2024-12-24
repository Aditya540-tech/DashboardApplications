import express from "express";
import cors from "cors";
import User from "./mongodb/models/UserSchema.js";
import connectDB from "./mongodb/connection.js";
import * as dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import morgan from "morgan";
import { isAdmin } from "./middleware/middleware.js";
import UserSchema from "./mongodb/models/UserSchema.js";
import ListingUserSchema from "./mongodb/models/ListingUserSchema.js";

dotenv.config();
const app = express();
app.use(cors(
  {
    origin:["https://deploy-mern-1whq.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }
));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    //Validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!role) {
      return res.send({ message: "Role is required" });
    }

    //check user
    const exisitingUser = await User.findOne({ email });
    //exisiting user
    if (exisitingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    user.save();

    console.log(user);
    res
      .status(200)
      .json({ success: true, message: "User Registered Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

app.use("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid email and password" });
    }
    const user = await User.findOne({ email });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid email and password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res
      .status(200)
      .json({ success: true, message: "Login Successfully" }, token);
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

app.use("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

app.use("/api/addUser", async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    if (!name) {
      return res.status(500).send({ message: "Name is required" });
    }
    if (!email) {
      return res.status(500).send({ message: "Email is required" });
    }
    if (!role) {
      return res.status(500).send({ message: "Role is required" });
    }

    const exisitingUser = await UserSchema.findOne({ email });
    if (exisitingUser) {
      return res.status(500).send({ message: "User is exist", success: false });
    }

    const user = await new ListingUserSchema({
      name,
      email,
      role,
    }).save();
    res
      .status(200)
      .send({ success: true, message: "User is created successfully", user });
  } catch (error) {
    res.status(500).send({ success: false, message: "User is not Add" });
  }
});

app.use("/api/deleteUser", async (req, res) => {
  try {
    const { email } = req.body;
    const { id } = req.params;
    await ListingUserSchema.findOneAndDelete(email);
    res.status(201).send({ message: "Listing User is Deleted", success: true });
  } catch (error) {
    res.status(500).send({ message: "Error in Deleting User", success: false });
  }
});

app.use("/api/updateUser", async (req, res) => {
  try {
    const { email, status } = req.body;
    const user = await ListingUserSchema.findOneAndUpdate({
      email,
      status: "Completed",
    });
    user.save();
    res.status(201).send({ success: true, message: "Status is updated" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error in updating status", success: false });
  }
});

app.use("/api/getuser", async (req, res) => {
  try {
    const user = await ListingUserSchema.find({});
    res
      .status(200)
      .send({ message: "Getting User Details", success: true, user });
  } catch (error) {
    res.status(500).send({ message: "Error in getting user", success: false });
  }
});
app.use("/", (req, res) => {
  res.send("Hello this is the backend");
});

const startServer = async () => {
  try {
    connectDB();
    app.listen(8080, () => {
      console.log("Server is listening on port 8080");
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
