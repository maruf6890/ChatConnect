import mongoose from "mongoose";
import ChatRoom from "../models/chatroom.models.js";
import Message from "../models/message.models.js";

// Join private chatroom
const joinChatRoom = async (req, res) => {
    try {
        const data = req.body;

        // Validate required fields
        if (!data.user1 || !data.user2) {
            return res.status(400).json({ message: "User1 and User2 are required" });
        }

        // Ensure user1 and user2 are not the same
        if (data.user1 === data.user2) {
            return res.status(400).json({ message: "User1 and User2 cannot be the same" });
        }

        const user1Id = new mongoose.Types.ObjectId(data.user1);
        const user2Id = new mongoose.Types.ObjectId(data.user2);
        // Check if the private chatroom already exists
        const chatRoom = await ChatRoom.findOne({
            type: "private",
            participants: { $all: [user1Id, user2Id] },
        });

        if (!chatRoom) {
            // If the chatroom doesn't exist, create a new one
            const newChatRoom = new ChatRoom({
                type: "private",
                participants: [user1Id, user2Id],
            });

            await newChatRoom.save();

            return res.status(201).json({ 
                message: "New chatroom created successfully", 
                id: newChatRoom._id 
            });
        }

        // If chatroom exists, return its details
        return res.status(200).json({ 
            message: "Joined existing chatroom successfully", 
            id: chatRoom._id 
        });
    } catch (error) {
        console.error("Error joining chatroom:", error);

        // Handle MongoDB or Mongoose-specific errors more gracefully
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: "Validation error", details: error.message });
        }

        res.status(500).json({ message: "Internal server error" });
    }
};




//get room data by id
const getChatRoomById = async (req, res) => {
    try {
        const roomId = req.params.id;
        const chatRoom = await ChatRoom.findById(roomId).populate("participants", "name email profilePicture friends bio lastSeen isVerified");
        if (!chatRoom) {
            return res.status(404).json({ message: "Chatroom not found" });
        }
        return res.status(200).json(chatRoom);
    } catch (error) {
        console.error("Error fetching chatroom:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
const getOldMessage = async (req, res) => {
    try {
      const { id: roomId } = req.params;
      const { page = 1, limit = 20 } = req.query; // Fix: Removed parentheses
      const skip = (page - 1) * Number(limit);
  
      // Validate roomId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: "Invalid chat room ID" });
      }
  
      const messages = await Message.find({ chatRoom: roomId })
        .sort({ createdAt: 1 }) // Older messages first
        .skip(skip)
        .limit(Number(limit))
        .lean();
  
      res.json({ messages }); // No need to reverse
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages", error });
    }
  };

export {getOldMessage, joinChatRoom,getChatRoomById };
