import express from "express"
import { getmessage, getuser, sendmessage } from "../controller/messagecontroller"
import { authmiddleware } from "../middelware/authmiddleware"
const router = express.Router()

router.post('/sendmessage/:to',authmiddleware as unknown as any,sendmessage as unknown as any)
router.post('/getmessage/:to',authmiddleware as unknown as any,getmessage as unknown as any)
router.post('/getconversation',authmiddleware as unknown as any,getuser as unknown as any)


export default router