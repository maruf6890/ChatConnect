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
     type: String,
    },
  },
  { timestamps: true }
);

// Pre-save hook to ensure participants are always sorted
ChatRoomSchema.pre('save', function (next) {
  if (this.type === "private") {
    this.participants.sort((a, b) => a.toString().localeCompare(b.toString()));
  }
  next();
});


const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);

export default ChatRoom;
