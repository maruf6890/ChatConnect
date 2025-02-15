import { Router } from "express";
const router= Router();

import { getChatRoomById, getMessageHistory, getOldMessage, joinChatRoom, searchOldMessages } from "../controllers/chatroom.controller.js";
import { verifyAuth } from "../Middlewares/auth.middlewares.js";

router.post('/join',verifyAuth, joinChatRoom);
router.get('/old',verifyAuth,getMessageHistory);
router.get('/search',verifyAuth,searchOldMessages);
router.get('/messages/:id', getOldMessage);
router.get('/:id', getChatRoomById);


export default router;