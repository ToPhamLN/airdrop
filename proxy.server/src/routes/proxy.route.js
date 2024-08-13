import express from 'express'
import proxyController from '../controllers/proxy.controller.js'

const router = express.Router()

router.post('/create', proxyController.createProxy)
router.get('/all', proxyController.getAll)

export default router
