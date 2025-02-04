import { useContext, useEffect, useState } from "react";
import { Avatar, TextField, IconButton, Button } from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import AuthContext from "../Components/AuthProvider";
import { useNavigate } from "react-router";
import User from "../../../Backend/models/user.models";

const Profile = () => {
const navigate=useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState(currentUser?.name);
  const [bio, setBio] = useState(currentUser?.bio);
  const [avatar, setAvatar] = useState(currentUser?.avatar);
  const [editName, setEditName] = useState(false);
  const [editBio, setEditBio] = useState(false);

  // Function to update currentUser profile
  const updateProfile = async (updatedData) => {
    try {
      const res=await axios.patch("http://localhost:3000/api/v1/user/update-profile",updatedData,{withCredentials:true});
      console.log(res.data);
     
    } catch (error) {
      alert(error.response.data.message);
    }
  
  };

  // Handle avatar upload
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
        const uploadResponse = await axios.post("http://localhost:3000/api/v1/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (uploadResponse && uploadResponse.data) {
            try {
                const updateResponse = await axios.post(
                    "http://localhost:3000/api/v1/user/update-avatar",
                    { avatar: uploadResponse.data.imageUrl },
                    { withCredentials: true }
                );

                console.log(updateResponse.data.avatar);
                setAvatar(updateResponse.data.avatar); // Ensure correct field is used
                alert(updateResponse.data.message);
            } catch (error) {
                console.error("Update failed:", error);
                alert(error.response?.data?.message || "Failed to update avatar.");
            }
        }

    } catch (error) {
        console.error("Upload failed:", error);
        alert(error.response?.data?.message || "Failed to upload image.");
    }
};

useEffect(() => {
  setAvatar(currentUser?.profilePicture);
}, 
[avatar,currentUser?.profilePicture]);

  return (
    <div className="w-full  mx-auto p-6 px-10 bg-white rounded-xl ">
      {/* Profile Picture */}
      <div className="border border-red-gray-300 p-20">
      <div className="flex  flex-col items-center">
        <label htmlFor="avatar-upload" className="cursor-pointer relative group">
          <Avatar src={avatar} alt="Profile" sx={{ width: 100, height: 100 }} />
          {/* Pencil icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
            <Edit className="text-white" />
          </div>
        </label>
        <input id="avatar-upload" type="file" className="hidden" onChange={handleUpload} />
      </div>

      {/* Editable Name */}
      <div className="flex items-center justify-center mt-4">
        {editName ? (
          <TextField
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              updateProfile({ name: e.target.value });
            }}
            onBlur={() => setEditName(false)}
            autoFocus
          />
        ) : (
          <h2 className="text-xl font-semibold mr-5">{name}</h2>
        )}
        {!editName ? <IconButton onClick={() => setEditName(true)}>
          <Edit fontSize="small" />
        </IconButton>:" "}
      </div>
      <div className=" text-center">
        <p className="text-gray-600">{currentUser?.email}</p>
      </div>
      {/* Editable Bio */}
      <div className="flex items-center justify-center mt-2">
        {editBio ? (
          <TextField
            variant="outlined"
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              updateProfile({ bio: e.target.value });
            }}
            onBlur={() => setEditBio(false)}
            autoFocus
            multiline
            rows={2}
          />
        ) : (
          <p className="text-gray-600 mr-5">{(bio)?bio:"No bio"}</p>
        )}
        
         { (!editBio) ?<IconButton onClick={() => setEditBio(true)}>
          <Edit fontSize="small" />
        </IconButton> : " "}
    
        
      </div>
      </div>

      {/* Email */}
      

      {/* Menu Options at Bottom */}
      <div className="mt-6 flex flex-col items-center">
        <Button variant="outlined" sx={{marginBottom: "10px"}} className="mb-5" onClick={() => navigate("/app/friend-list")}>
          Friend List
        </Button>
        <Button variant="outlined" className="mt-5" onClick={() =>  navigate("/app/block-list")}>
          Block List
        </Button>
      </div>
    </div>
  );
};

export default Profile;
