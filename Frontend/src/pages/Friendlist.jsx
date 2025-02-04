import { useState } from "react";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";

const FriendList = () => {
  // Dummy Friend Data
  const [friends, setFriends] = useState([
    { _id: "1", name: "John Doe", email: "john@example.com", avatar: "https://i.pravatar.cc/100?img=1" },
    { _id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "https://i.pravatar.cc/100?img=2" },
    { _id: "3", name: "Michael Brown", email: "michael@example.com", avatar: "https://i.pravatar.cc/100?img=3" },
    { _id: "4", name: "Emily Davis", email: "emily@example.com", avatar: "https://i.pravatar.cc/100?img=4" },
  ]);

  // Unfriend Function
  const handleUnfriend = (friendId) => {
    setFriends(friends.filter((friend) => friend._id !== friendId));
  };

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
