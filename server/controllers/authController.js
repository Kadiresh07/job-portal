const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/apiResponse");

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return error(res, "User already exists", 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });

  const token = generateToken({ id: user._id, role: user.role });

  success(
    res,
    { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    "User registered successfully",
    201
  );
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return error(res, "Invalid credentials", 401);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return error(res, "Invalid credentials", 401);

  const token = generateToken({ id: user._id, role: user.role });

  success(res, {
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return error(res, "User not found", 404);
  success(res, { user });
});
