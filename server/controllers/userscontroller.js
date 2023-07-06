const User = require("../model/userModel");
const bcrypt = require("bcrypt");
module.exports.register = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { username, password, email } = req.body;
    const checkUsername = await User.findOne({ username: username });
    if (checkUsername)
      return res.json({ msg: "Username already exists", status: false });
    const checkEmail = await User.findOne({ email: email });
    if (checkEmail)
      return res.json({ msg: "Email already exists", status: false });

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedpassword,
    });

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.login = async (req, res, next) => {
  // console.log(req.body);
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) return res.json({ msg: "Username not exists", status: false });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect username or password", status: false });

    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    // console.log(userData);
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
    // console.log(req);
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "_id",
        "avatarImage",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};
