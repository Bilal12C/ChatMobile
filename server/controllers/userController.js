const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { use } = require("bcrypt/promises");

module.exports.login = async (req, res, next) => {
  try {
    const { name, Password } = req.body;
    console.log("sd",name,Password)
    const user = await User.findOne({ name });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
      const {email } = req.body;
      const finduser = await User.findOne({ email: email });
      if (finduser)
      return res.json({ msg: "Email already used", status: false });
      if (!finduser) {
          console.log("finduser",finduser)
          console.log(req.body.Password)
          const hash = await bcrypt.hash(req.body.Password,10);
          console.log("jhas",hash)
         const user = await User.create({
          name: req.body.name,
          email: email,
          Password: hash,
        });
        return res.json({ status: true, msg:"User has been Registered" });
      }
  } catch (error) {
      res.status(400).send({msg:"User already exists",status:200})
  }

}



module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "name",
      "_id",
    ]);
    console.log("user",users)
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    console.log("Adasd",req.params.id)
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
