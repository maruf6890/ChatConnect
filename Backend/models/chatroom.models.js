import mongoose from "mongoose";

const ChatRoomSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["private", "group"],
      required: true,
    },
    name: {
      type: String,
      required: function () {
        return this.type === "group";
      },
      trim: true,
    },
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User", // Reference to the User model
      required: true,
      validate: [
        {
          validator: function (value) {
            if (this.type === "private") {
              return value.length === 2; // Exactly 2 participants for private chats
            }
            return true;
          },
          message: "Private chatrooms must have exactly two participants.",
        },
        {
          validator: function (value) {
            if (this.type === "group") {
              return value.length >= 2; // At least 2 participants for group chats
            }
            return true;
          },
          message: "Group chatrooms must have at least two participants.",
        },
      ],
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message", // Reference to the last message in the chat
    },
  },
  { timestamps: true }
);

// Unique index for private chatrooms to prevent duplication
ChatRoomSchema.index(
  { type: 1, participants: 1 },
  { unique: true, partialFilterExpression: { type: "private" } }
);

const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

export default ChatRoom;
