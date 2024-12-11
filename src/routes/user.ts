import express from 'express'

import { getme, signin, signup } from '../controller/userroutes'
import { authmiddleware } from '../middelware/authmiddleware'
const router = express.Router()
router.post("/signup",signup)
router.post("/signin",signin)
router.get("/getme",authmiddleware as unknown as any,getme as unknown as any)


export default router