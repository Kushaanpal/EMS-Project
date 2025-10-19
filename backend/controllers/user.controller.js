import User from "../models/User.js";

// @desc   Get logged-in user details
// @route  GET /api/users/me
// @access Private
export const getMe = async (req, res) => {
  try {
    // `req.user` is populated by `protect` middleware
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};
