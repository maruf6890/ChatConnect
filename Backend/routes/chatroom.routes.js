import { Router } from "express";
const router= Router();

import { getChatRoomById, getOldMessage, joinChatRoom } from "../controllers/chatroom.controller.js";
import { verifyAuth } from "../Middlewares/auth.middlewares.js";

router.post('/join',verifyAuth, joinChatRoom);
router.get('/:id', getChatRoomById);
router.get('/messages/:id', getOldMessage);
export default router;