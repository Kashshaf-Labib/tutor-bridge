import * as userService from "./user.service.js";

const updateUserPhone = async (req, res) => {
  try {
    const userId = req.user._id;
    const { phone } = req.body;

    const updatedUser = await userService.updatePhone(userId, phone);
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        token: req.user.token // Keep the existing token
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const updatedUser = await userService.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phone: updatedUser.phone,
        // Note: We don't need to generate a new token since user ID hasn't changed
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export { updateUserPhone, updateUserPassword };
