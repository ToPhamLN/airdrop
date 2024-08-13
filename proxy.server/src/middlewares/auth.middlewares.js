import jwt from 'jsonwebtoken'
import UserModel from '../models/user.models.js'

export const verifyToken = async (req, res, next) => {
  const token = req.headers.token
  if (token) {
    const accessToken = token.split(' ')[1]

    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, async (err, user) => {
      if (err) {
        res.status(403).json({
          message: 'Token is not valid'
        })
      }
      try {
        const existed = await UserModel.findById(user.userId)
        if (user && !existed) {
          res.status(403).json({
            message: 'User is not valid'
          })
        }
        req.user = existed
        next()
      } catch (error) {
        next(error)
      }
    })
  } else {
    res.status(401).json({
      message: "You're not authenticated!"
    })
  }
}

export const verifyTokenAndAuthAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next()
    } else {
      return res.status(403).json({
        message: "You're not authorized to perform this action!"
      })
    }
  })
}
