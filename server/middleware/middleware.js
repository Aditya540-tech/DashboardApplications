import UserSchema from "../mongodb/models/UserSchema.js";

export const isAdmin = async (req, res, next) => {
  try {
    const data = await UserSchema.findById(req.user._id);
    console.log(data);
    const { isAdmin } = req.body;
    if (isAdmin) {
      next();
    } else {
      res.status(401).send({ success: false, message: "User is not Admin" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error in Admin", success: false });
  }
};
