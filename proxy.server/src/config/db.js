import mongoose from 'mongoose'

export const connect = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(process.env.MONGOOSE_URL, {})
    console.log('[database]: Connect database successfully!!!')
  } catch (error) {
    console.log('[database]: Connect database failure!!!')
  }
}
