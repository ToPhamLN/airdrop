import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user?._id,
      role: user?.role
    },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: '30d' }
  )
}

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user?._id,
      role: user?.role
    },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: '365d' }
  )
}
