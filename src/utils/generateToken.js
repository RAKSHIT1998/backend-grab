import jwt from 'jsonwebtoken';

export const generateToken = (user, expiresIn = "7d") => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email || null,
      phone: user.phone || null,
    },
    process.env.JWT_SECRET || "defaultsecret",
    {
      expiresIn,
    }
  );
};
