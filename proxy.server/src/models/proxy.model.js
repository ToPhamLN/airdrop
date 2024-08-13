import { Schema, model } from 'mongoose'

const proxySchema = new Schema(
  {
    port: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const ProxyModel = model('Proxy', proxySchema)
export default ProxyModel
