import { useContext, useEffect, useState } from "react";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import { useFormAction } from "react-router";
import axios from "axios";
import AuthContext from "../Components/AuthProvider";

const FriendList = () => {
  // Dummy Friend Data
  const [friends, setFriends] = useState([]);
  const {currentUser}= useContext(AuthContext);
  // Unfriend Function
  const handleUnfriend = (friendId) => {
    const updateUser = async () => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}user/remove`, { userId: currentUser?._id, friendId }, { withCredentials: true });
          alert(res.data.message);
      } catch (error) {
          alert(error.response.data.message);
      }
      
     };
     updateUser();
    setFriends(friends.filter((friend) => friend._id !== friendId));
  };


  useEffect(() => {
    const fetchFriend = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}user/friend-list`,
          { withCredentials: true }
        );
        setFriends(response.data)
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriend();
  }, []);


  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl ">
      <h2 className="text-2xl font-semibold text-center mb-4">Friend List</h2>

      <div className="">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <Card key={friend._id} className="shadow-md mb-5" >
              <CardContent className="flex items-center gap-4">
                <Avatar src={friend.avatar} sx={{ width: 50, height: 50 }} />
                <div className="flex-1">
                  <Typography variant="h6">{friend.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {friend.email}
                  </Typography>
                </div>
                <Button variant="contained" color="error" size="small" onClick={() => handleUnfriend(friend._id)}>
                  Unfriend
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No friends found.</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
