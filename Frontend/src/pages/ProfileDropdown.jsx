import { useContext, useEffect, useState } from "react";
import { Avatar,Snackbar,Alert, Button, Menu, MenuItem, Divider } from "@mui/material";
import { PersonAdd, PersonRemove, Block, CheckCircle } from "@mui/icons-material";
import AuthContext from "../Components/AuthProvider";
import axios from "axios";


const ProfileDropdown = ({ other, user }) => {
    const [openAlert,setOpenAlert]= useState(false);
    const [openAlert2,setOpenAlert2]= useState(false);
    const { currentUser } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const [isFriend, setIsFriend] = useState(false);
    const [isBlocked, setIsBlocked] = useState(currentUser?.blockedUsers.includes(other?._id)|| false);
    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert(false);
      };
      const handleCloseAlert2 = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenAlert2(false);
      };
    const open = Boolean(anchorEl);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const toggleFriend = () => {

        if (isFriend) {
            // Unfriend
            const updateUser = async () => {
                try {
                    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/remove`, { userId: currentUser?._id, friendId: other?._id }, { withCredentials: true });
                    setOpenAlert(true);
                    setIsFriend(!isFriend);
                } catch (error) {
                    alert(error.response.data.message);
                }
                
            };
            updateUser();
           
           currentUser.friends = currentUser.friends.filter((friendId) => friendId !== other?._id);
           console.log(currentUser.friends);
             
        }else{
            // Add friend
            const updateUser = async () => {
                try {
                    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/add`, { userId: currentUser?._id, friendId: other?._id }, { withCredentials: true });
                    setOpenAlert2(true);
                    setIsFriend(!isFriend);
                } catch (error) {
                    alert(error.response.data.message);
                }
                
            };
            updateUser();
           
            currentUser?.friends.push(other?._id);
            
        }
        
    };
    const toggleBlock = async () => {
        console.log("Before Toggle:", isBlocked);
    
        try {
            let res;
            if (isBlocked) {
                // Unblock user
                res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/unblock`, {
                    userId: currentUser?._id,
                    unBlockedUserId: other?._id
                }, { withCredentials: true });
    
                // Remove from blocked list
                currentUser.blockedUsers = currentUser.blockedUsers.filter(id => id !== other?._id);
            } else {
                // Block user
                res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/block`, {
                    userId: currentUser?._id,
                    blockedUserId: other?._id
                }, { withCredentials: true });
    
                // Add to blocked list
                currentUser?.blockedUsers.push(other?._id);
            }
    
            alert(res.data.message);
            setIsBlocked(!isBlocked);
            console.log("Updated Blocked Users:", currentUser.blockedUsers);
    
        } catch (error) {
            alert(error.response?.data?.message || "Something went wrong.");
            console.error("Toggle Block Error:", error);
        }
    };
    

    // Update isFriend when `currentUser` or `other?.friends` changes
    useEffect(() => {
        if (other?.friends?.includes(currentUser?._id)) {
            setIsFriend(true);
        } else {
            setIsFriend(false);
        }
    }, [currentUser, other?.friends]);
    
    
    useEffect(() => {
        if (currentUser?.blockedUsers?.some(id => id.toString() === other?._id?.toString())) {
            console.log(currentUser?.blockedUsers);
           setIsBlocked(true);
        } else {
            setIsBlocked(false);
        }
    }, [currentUser?.blockedUsers, other?._id]);
   
    return (
        <div className="relative">
            {/* Profile Image Button */}
            <button onClick={handleClick} className="p-2 rounded-full">
                <Avatar src={other?.profilePicture} alt={other?.name} />
            </button>

            {/* Dropdown Menu */}
            <Menu
                anchorEl={anchorEl}
                sx={{
                    "& .MuiPaper-root": {
                        width: "340px",
                        maxHeight: "50vh",
                        overflow: "auto",
                        border: "1px solid #ccc",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", 
                        borderRadius: "8px",
                    },
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                open={open}
                onClose={handleClose}
            >
                <div className="p-10">
                    <Avatar
                        src={user?.profilePicture || "/default-avatar.png"}
                        alt={other?.username}
                        className="w-16 h-16 mx-auto"
                    />
                    <h3 className="text-center text-lg font-semibold mt-2">{other?.name}</h3>
                    <p className="text-center text-sm text-gray-600">{other?.email}</p>
                    <p className="text-center text-sm text-gray-500">
                        {other?.bio || "No bio available"}
                    </p>
                </div>

                <Divider />

                {/* Friend Toggle */}
                <MenuItem onClick={toggleFriend} className="flex items-center space-x-2">
                    {isFriend ? (
                        <PersonRemove className="text-red-500" />
                    ) : (
                        <PersonAdd className="text-green-500" />
                    )}
                    <span>{isFriend ? "Unfriend" : "Add Friend"}</span>
                </MenuItem>

                {/* Block Toggle */}
                <MenuItem onClick={toggleBlock} className="flex items-center space-x-2">
                    {isBlocked ? (
                        <CheckCircle className="text-blue-500" />
                    ) : (
                        <Block className="text-gray-600" />
                    )}
                    <span>{isBlocked ? "Unblock User" : "Block User"}</span>
                </MenuItem>
            </Menu>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert
                      onClose={handleCloseAlert}
                      severity="success"
                      variant="filled"
                      sx={{ width: '100%' }}
                    >
                      You are no longer friend with him/her
                    </Alert>
                  </Snackbar>
                  <Snackbar open={openAlert2} autoHideDuration={6000} onClose={handleCloseAlert2}>
                    <Alert
                      onClose={handleCloseAlert2}
                      severity="success"
                      variant="filled"
                      sx={{ width: '100%' }}
                    >
                      You are now friends with him/her
                    </Alert>
                  </Snackbar>
        </div>
    );
};

export default ProfileDropdown;
