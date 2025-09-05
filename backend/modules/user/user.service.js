import bcrypt from "bcryptjs";
import User from "./user.model.js";

export const updatePhone = async (userId, phone) => {
  // Validate phone number
  if (!/^((\+8801|01)[0-9]{9})$/.test(phone)) {
    throw new Error("Invalid Bangladeshi phone number");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.phone = phone;
  await user.save();
  
  return user;
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Verify current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  
  return user;
};
