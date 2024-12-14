const User = require("../models/User");
const bcrypt = require("bcrypt");

const SignUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashPassword, role });
    await newUser.save();
    return res
      .status(201)
      .json({ message: `User Registered With Username ${name}` });
  } catch (err) {
    return res.status(500).json({ message: "Some thing Went Wrong in Signup" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = User.find(email);
    if (!user) {
      return res.status(404).json({ message: `User Not Found ${email}` });
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credental" });
    }
    let token;
    token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Some thing went wrong in Login" });
  }
};

module.exports = { SignUp, login };
