import express from "express"
import { getmessage, getuser, sendmessage } from "../controller/messagecontroller"
import { authmiddleware } from "../middelware/authmiddleware"
const router = express.Router()

router.post('/sendmessage/:to',authmiddleware ,sendmessage )
router.post('/getmessage/:to',authmiddleware ,getmessage )
router.post('/getconversation',authmiddleware ,getuser )


export default router