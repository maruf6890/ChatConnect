import User from "../models/user.models.js";
import bcrypt from "bcrypt";
import mongoose, { get } from "mongoose";
import jwt from "jsonwebtoken";
// Register (Add) a New User
const createUser = async (req, res) => {
  try {
    console.log("trigger");
    const { name, email, password } = req.body;

    console.log(req.body);
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }


    
    const existingUser = await User.findOne({ email:email});
    if (existingUser) {
      return res.status(409).json({ message: "User already exists. Please log in." });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      
    });


    const createdUser=await  User.findOne({email:email}).select('-password' );

    if(createdUser){
        res.status(201).json({ success: true, message: "User registered successfully!", userId: newUser._id,email:newUser.email });
    }
    
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


//login user
const loginUser= async(req,res) =>{
  try {
    const {email,password}=  req.body;
    console.log(email,password);
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
   const user= await User.findOne({email:email});
   if(!user){
      return res.status(400).res.json({message:"User does't registered on this email"});
   }
  
  
   // Validate the password
   const isPasswordValid = await bcrypt.compare(password, user.password);
   if (!isPasswordValid) {
     return res.status(401).json({ message: "Invalid email or password." });
   }

   // Generate JWT access token
   const accessToken = jwt.sign(
     { id: user._id, email: user.email, role: user.role },
     process.env.AUTH_SECRET,
     { expiresIn:   process.env.AUTH_EXPIRE}
   );

   // Set the token in an HTTP-only cookie
   res.cookie("accessToken", accessToken, {
     httpOnly: true, // Cookie cannot be accessed via JavaScript
     secure: process.env.NODE_ENV === "production", // Use secure cookies in production
     maxAge: 3600000, // 1 hour
     sameSite: "strict", // Prevent CSRF
   });

   // Respond with user details (excluding sensitive fields)
   res.status(200).json({
     success: true,
     message: "Login successful.",
     user: {
       id: user._id,
       name: user.name,
       email: user.email,
       role: user.role,
     },
   });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

 const logoutUser = (req, res) => {
  try {
    // Clear the access token cookie
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Get a Single User by ID
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const user = await User.findById(userId).populate("booksOwned borrowedBooks wishlist");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Update User by ID
const updateUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Hash the password if it's being updated
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).populate(
      "booksOwned borrowedBooks wishlist"
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Delete User by ID
const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



// user.controller.js// user.controller.js
const getCurrentuser = async (req, res) => {
  try {
    console.log("Fetching current user");
    // If no user data is found, return an error
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. No user data." });
    }
    const currentUser = await User.findById(req.user.id).select('-password');
    // Return the user data
    res.status(200).json({ user: currentUser });
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



//search user from front end 
const searchUser= async(req,res)=>{
  const { query } = req.query;
  console.log(query);
  try {
    const user=await User.find({name:{$regex:query,$options:"i"}}).limit(5).select('-password');  
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error." });
  }

}

  //add friend 
  const addFriend = async (req, res) => {
    const { userId, friendId } = req.body;
    console.log(req.body);
  
    // Validate input
    if (!userId || !friendId) {
      return res.status(400).json({ message: "User ID and Friend ID are required." });
    }
  
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid User ID or Friend ID." });
    }
  
    try {
      // Fetch both users
      const [user, friend] = await Promise.all([
        User.findById(userId),
        User.findById(friendId),
      ]);
  
      // Check if users exist
      if (!user || !friend) {
        return res.status(404).json({ message: "User or Friend not found." });
      }
  
      // Check if already friends
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: "You are already friends." });
      }
  
      // Add friend
      user.friends.push(friendId);
      friend.friends.push(userId);
  
      // Save both users concurrently
      await Promise.all([user.save(), friend.save()]);
  
      res.status(200).json({ message: "Friend added successfully." });
    } catch (error) {
      console.error(error); // Log error for debugging
      res.status(500).json({ message: "Internal server error." });
    }
  };
  


  //const user unfriend
  const unfriend = async (req, res) => {
    const { userId, friendId } = req.body;
  
    // Validate input
    if (!userId || !friendId) {
      return res.status(400).json({ message: "User ID and Friend ID are required." });
    }
  
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(friendId)) {
      return res.status(400).json({ message: "Invalid User ID or Friend ID." });
    }
  
    try {
      const [user, friend] = await Promise.all([
        User.findById(userId),
        User.findById(friendId),
      ]);

      if (!user || !friend) {
        return res.status(404).json({ message: "User or Friend not found." });
      }

      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: "You are not friends." });
      }
      user.friends = user.friends.filter((id) => id.toString() !== friendId.toString());
      friend.friends = friend.friends.filter((id) => id.toString() !== userId.toString());
      await Promise.all([user.save(), friend.save()]);
      
      res.status(200).json({ message: "Friend removed successfully." });
      
    } catch (error) {
      res.status(500).json({ message: "Internal server error." });
    }
  }


  //block user 
  const blockUser = async (req, res) => {
    const { userId, blockedUserId } = req.body;
    console.log(req.body);
    // Validate input   
    if (!userId || !blockedUserId) {
      return res.status(400).json({ message: "User ID and Blocked User ID are required." });
    }
  
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(blockedUserId)) {
      return res.status(400).json({ message: "Invalid User ID or Blocked User ID." });
    }
  
    if (userId === blockedUserId) {
      return res.status(400).json({ message: "You cannot block yourself." });
    }
  
    try {
      const [user, blockedUser] = await Promise.all([
        User.findById(userId),
        User.findById(blockedUserId),
      ]);
  
      if (!user || !blockedUser) {    
        return res.status(404).json({ message: "User or Blocked User not found." });
      }     
  
      // Use `.equals()` for ObjectId comparison
    
      if (user.blockedUsers.some(id => id.equals(blockedUserId))) {
        return res.status(400).json({ message: "You have already blocked this user." });
      } 
  
      user.blockedUsers.push(blockedUserId);
      await user.save();
  
      res.status(200).json({ message: "User blocked successfully." });
  
    } catch (error) {
      console.error("Block User Error:", error); // Debugging
      res.status(500).json({ message: "Internal server error." });
    }
  };
  


  const unBlockUser = async (req, res) => {
    const { userId, unBlockedUserId } = req.body;
    console.log(req.body);
  
    // Validate input
    if (!userId || !unBlockedUserId) {
      return res.status(400).json({ message: "User ID and unblockable user id are required." });
    }
  
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(unBlockedUserId)) {
      return res.status(400).json({ message: "Invalid User ID or Friend ID." });
    }
  
    try {
      const [user, unBlockedUser] = await Promise.all([
        User.findById(userId),
        User.findById(unBlockedUserId),
      ]);
  
      if (!user || !unBlockedUser) {
        return res.status(404).json({ message: "User or Friend not found." });
      }
  
      if (!user.blockedUsers.includes(unBlockedUserId)) {
        return res.status(400).json({ message: "You are not blocked." });
      } 

      user.blockedUsers= user.blockedUsers.filter((id) => id.toString() !== unBlockedUserId.toString());
      await user.save();
  
      res.status(200).json({ message: "User unblocked successfully." });
    } catch (error) {
      res.status(500).json({ message: "Internal server error.", error });     
      }
  }


 // Update Avatar
const updateAvatar = async (req, res) => {
  console.log(req.body);
  console.log(req.user);

  if (!req.user || !req.user.id) {

    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const user = await User.findById(req.user.id); // Await the function
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ message: "Avatar URL is required." });
    }

    user.profilePicture = avatar;
    await user.save();

    res.status(200).json({ message: "Avatar updated successfully.", avatar: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

// Update Name or Bio
const updateProfile = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  console.log(req.body);
  console.log(req.user);
  try {
    const user = await User.findById(req.user.id); 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const updatedData = {}; 

    if (req.body.name) {
      user.name = req.body.name;
      updatedData.name = user.name;
    }
    if (req.body.bio) {
      user.bio = req.body.bio;
      updatedData.bio = user.bio;
    }

    await user.save();
   
    res.status(200).json({ message: "Profile updated successfully.",updatedData});
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error });
  }
};

export { createUser,updateAvatar, updateProfile, addFriend, unfriend, blockUser, unBlockUser, loginUser, searchUser,  logoutUser, getAllUsers, getUserById, updateUserById,getCurrentuser, deleteUserById };
