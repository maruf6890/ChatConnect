import mongoose from "mongoose";
import ChatRoom from "../models/chatroom.models.js";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";

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
  
      // Validate that user IDs are valid ObjectIds
      if (!mongoose.Types.ObjectId.isValid(data.user1) || !mongoose.Types.ObjectId.isValid(data.user2)) {
        return res.status(400).json({ message: "Invalid user IDs" });
      }
  
      const user1Id = new mongoose.Types.ObjectId(data.user1);
      const user2Id = new mongoose.Types.ObjectId(data.user2);
  
      // Sort participants consistently to avoid ordering issues
      const participants = [user1Id, user2Id].sort((a, b) => a.toString().localeCompare(b.toString()));
  
      // Check if the private chatroom already exists with the sorted participants
      const existingChatRoom = await ChatRoom.findOne({
        type: "private",
        participants: { $all: participants, $size: 2 },  // Ensures exactly two participants, in any order
      });
  
      if (!existingChatRoom) {
        // If the chatroom doesn't exist, create a new one
        const newChatRoom = new ChatRoom({
          type: "private",
          participants: participants,
        });
  
        await newChatRoom.save();
  
        return res.status(201).json({
          message: "New chatroom created successfully",
          id: newChatRoom._id,
        });
      }
  
      // If chatroom exists, return its details
      return res.status(200).json({
        message: "Joined existing chatroom successfully",
        id: existingChatRoom._id,
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
      const { page = 1, limit = 20 } = req.query; 
      const skip = (page - 1) * Number(limit);
  
      // Validate roomId
      if (!mongoose.Types.ObjectId.isValid(roomId)) {
        return res.status(400).json({ message: "Invalid chat room ID" });
      }
  
      const messages = await Message.find({ chatRoom: roomId })
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(Number(limit))
        .lean();
  
      res.json({ messages }); // No need to reverse
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages", error });
    }
  };




  //get last 10 history

  const getMessageHistory = async (req, res) => {
    console.log(req.user.id);
    if (!req.user || !req.user.id) {
      console.log("User does not exist");
      return res.status(401).json({ message: "No user found" });
    }
  console.log(req.user._id);
    try {
      const history = await ChatRoom.find({ participants: { $in: [req.user.id] } })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("participants", "name email profilePicture");
  
      return res.status(200).json({ history });
    } catch (error) {
      console.error("Error fetching message history:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };




  
  const searchOldMessages = async (req, res) => {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "No user found" });
    }
  
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    try {
      let otherUser = await User.findOne({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } }
        ]
      });
  
      if (!otherUser) {
        return res.status(404).json({ message: "No user found" });
      }
  
      const history = await ChatRoom.find({
        participants: { $all: [req.user.id, otherUser._id] }
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("participants", "name email profilePicture");
  
      return res.status(200).json({ history });
    } catch (error) {
      console.error("Error searching old messages:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
export {getOldMessage,searchOldMessages,getMessageHistory, joinChatRoom,getChatRoomById };
