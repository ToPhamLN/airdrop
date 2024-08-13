import fs from 'fs'
import readline from 'readline'
import axios from 'axios'
import { HttpsProxyAgent } from 'https-proxy-agent'
import colors from 'colors'

class Proxy {
  constructor() {
    this.service = new Service()
    this.domainServer = 'https://37nfnuiqg8xo8.ahost.marscode.site'
  }

  async postProxy(payload) {
    const api = `${this.domainServer}/proxies/create`
    try {
      const res = await axios.post(api, {
        port: JSON.stringify(payload)
      })
      const { success, error } = res.data

      if (Array.isArray(success) && success.length > 0) {
        this.service.log(colors.green('Các proxy đã lưu thành công:'))
        for (const item of success) {
          this.service.log(colors.green(item))
          this.service.appendFile('./worker/proxy.sussess.txt', item)
        }
      }

      if (Array.isArray(error) && error.length > 0) {
        this.service.log(colors.red('Các proxy lưu không thành công:'))
        for (const item of error) {
          this.service.log(colors.red(item))
          this.service.appendFile('./worker/proxy.error.txt', item)
        }
      }
    } catch (error) {
      this.log(colors.bgRed(error))
    }
  }

  async getProxy() {
    const api = `${this.domainServer}/proxies/all`
    try {
      const res = await axios.get(api)
      const proxy = res.data?.map((item) => item?.port)
      this.service.log(colors.green('Danh sách các proxy:'))

      if (Array.isArray(proxy) && proxy.length > 0) {
        for (const item of proxy) {
          this.service.log(colors.green(item))
          this.service.appendFile('./worker/proxy.data.txt', item)
        }
      }
    } catch (error) {
      this.log(colors.bgRed(error))
    }
  }

  async create() {
    this.service.log(colors.gray('☕ Bạn chờ chút nhé...'))
    this.service.resetFile('./worker/proxy.error.txt')
    this.service.readFile('./worker/proxy.sussess.txt')
    try {
      const createData = this.service.readFile('./worker/proxy.create.txt')
      if (!createData.length)
        return this.service.log(
          colors.bgRed('Bạn chưa nạp dữ liệu vào file proxy.create.txt !')
        )

      await this.postProxy(createData)
    } catch (error) {
      this.service.log(colors.bgRed(error.stack))
    } finally {
      this.service.log(colors.gray('Yêu cầu hoàn tất.'))
    }
  }

  async getAll() {
    this.service.log(colors.gray('☕ Bạn chờ chút nhé...'))
    this.service.readFile('./worker/proxy.data.txt')
    try {
      await this.getProxy()
    } catch (error) {
      this.service.log(colors.bgRed(error.stack))
    } finally {
      this.service.log(colors.gray('Yêu cầu hoàn tất.'))
    }
  }
}

class Service {
  log(msg) {
    console.log(`[*] ${msg}`)
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  async countdown(seconds) {
    for (let i = Math.floor(seconds); i >= 0; i--) {
      // eslint-disable-next-line no-undef
      readline.cursorTo(process.stdout, 0)
      // eslint-disable-next-line no-undef
      process.stdout.write(
        `===== Đã hoàn thành tất cả tài khoản, chờ ${i} giây để tiếp tục vòng lặp =====`
      )
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    console.log('')
  }

  async checkProxyIP(proxy) {
    try {
      const response = await axios.get('http://ipinfo.io/ip', {
        proxy: false,
        httpsAgent: new HttpsProxyAgent(proxy),
        timeout: 5000
      })
      if (response.status === 200) {
        this.loadFile('proxy.update.txt', proxy)
        return response.data.trim()
      } else {
        this.log(`Lỗi rồi:" ${response.status}`)
        this.loadFile('proxy.error.txt', proxy)
        return null
      }
    } catch (error) {
      this.loadFile('proxy.error.txt', proxy)
      this.log(`Lỗi rồi:" ${error.message}`)
      return null
    }
  }

  resetFile(filePath) {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8')
      console.log(`Đã tạo file: ${filePath}`)
    } else {
      fs.writeFile(filePath, '', (err) => {
        if (err) {
          this.log('Có lỗi khi xóa nội dung file:', err)
          return
        }
        this.log(`Nội dung file ${filePath} đã được xóa.`)
      })
    }
  }

  appendFile(filePath, item) {
    const fileContent = fs.readFileSync(filePath, 'utf8') ?? ''

    if (!fileContent.includes(item)) {
      fs.appendFileSync(filePath, item + '\n', 'utf8')
    }
  }

  readFile(filePath) {
    try {
      const data = fs.readFileSync(filePath, 'utf8')
      const dataArray = data.replace(/\r/g, '').split('\n').filter(Boolean)

      return dataArray
    } catch (err) {
      console.error(`Có lỗi khi đọc file: ${err.message}`)
      return []
    }
  }
}

const proxy = new Proxy()
// eslint-disable-next-line no-undef
const args = process.argv.slice(2)

if (args == 'create') proxy.create()
if (args == 'proxies') proxy.getAll()
