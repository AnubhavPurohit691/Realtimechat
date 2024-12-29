import express from 'express'

import { getme, signin, signup } from '../controller/userrcontroller'
import { authmiddleware } from '../middelware/authmiddleware'
const router = express.Router()
router.post("/signup",signup)
router.post("/signin",signin)
router.get("/getme",authmiddleware ,getme )


export default router