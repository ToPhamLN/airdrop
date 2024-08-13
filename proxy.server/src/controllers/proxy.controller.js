import { HttpsProxyAgent } from 'https-proxy-agent'
import ProxyModel from '../models/proxy.model.js'
import axios from 'axios'

class ProxyController {
  constructor() {
    this.proxyModel = ProxyModel
    this.getAll = this.getAll.bind(this)
    this.createProxy = this.createProxy.bind(this)
    this.createOne = this.createOne.bind(this)
    this.checkProxyIP = this.checkProxyIP.bind(this)
  }

  getAll = async (req, res, next) => {
    try {
      const proxies = await this.proxyModel.find()
      res.status(200).json(proxies)
    } catch (error) {
      next(error)
    }
  }

  createProxy = async (req, res, next) => {
    try {
      const { port } = req.body
      const ports = port ? JSON.parse(port) : []
      const results = { success: [], error: [] }

      for (const port of ports) {
        const result = await this.createOne(port)
        if (result) {
          results.success.push(result)
        } else {
          results.error.push(port)
        }
      }

      res.status(200).json(results)
    } catch (error) {
      next(error)
    }
  }

  createOne = async (port) => {
    const isValidProxy = await this.checkProxyIP(port)
    if (!isValidProxy) return null

    const existingProxy = await this.proxyModel.findOne({ port })
    if (existingProxy) return null

    const newProxy = new this.proxyModel({ port })
    await newProxy.save()

    return newProxy.port
  }

  checkProxyIP = async (proxy) => {
    try {
      const response = await axios.get('http://ipinfo.io/ip', {
        proxy: false,
        httpsAgent: new HttpsProxyAgent(proxy),
        timeout: 5000
      })

      return response.status === 200 ? response.data.trim() : null
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

export default new ProxyController()
