const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const User = require("../models/User");
const {
  singUpValidation,
  singInValidation,
} = require("../validation/userValidation");

exports.signUp = async (req, res) => {
  const { email, password, contact } = req.body;

  try {
    const { error } = singUpValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const exist = await User.findOne({ email });
    if (exist) return res.status(422).send("User Already Exist");

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = { ...req.body, password: hashedPassword };

    User.create(user, (err, data) => {
      if (err) return res.status(500).send(err);
      console.log(data);
      const token = jwt.sign(
        { id: data._id, email: data.email },
        process.env.USER_SECRET
      );
      res.status(201).json({ message: "Signup Successfuly", email, token });
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error } = singInValidation.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const exist = await User.findOne({ email });
    if (!exist) return res.status(400).send("User Not Found");

    const validPass = await bcrypt.compare(password, exist.password);
    if (validPass) return res.status(401).send("Incorrect Password");

    const token = jwt.sign(
      { id: exist._id, email: exist.email },
      process.env.USER_SECRET
    );
    const user = { email, token };

    res.status(200).json({
      message: "Login Success!",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "server error",
    });
  }
};

exports.dummy = async (req, res) => {
  console.log(req.userId);
  //   res.status(200).send(req.userId);
};
