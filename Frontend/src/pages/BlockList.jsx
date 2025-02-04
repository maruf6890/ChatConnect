import { useState } from "react";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";

const BlockList = () => {
  // Dummy Blocked Users Data
  const [blockedUsers, setBlockedUsers] = useState([
    { _id: "1", name: "David Miller", email: "david@example.com", avatar: "https://i.pravatar.cc/100?img=5" },
    { _id: "2", name: "Sarah Johnson", email: "sarah@example.com", avatar: "https://i.pravatar.cc/100?img=6" },
    { _id: "3", name: "Robert Wilson", email: "robert@example.com", avatar: "https://i.pravatar.cc/100?img=7" },
    { _id: "4", name: "Olivia Taylor", email: "olivia@example.com", avatar: "https://i.pravatar.cc/100?img=8" },
  ]);

  // Unblock Function
  const handleUnblock = (userId) => {
    setBlockedUsers(blockedUsers.filter((user) => user._id !== userId));
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl">
      <h2 className="text-2xl font-semibold text-center mb-4">Blocked Users</h2>

      <div>
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user) => (
            <Card key={user._id} className="shadow-md mb-5">
              <CardContent className="flex items-center gap-4">
                <Avatar src={user.avatar} sx={{ width: 50, height: 50 }} />
                <div className="flex-1">
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.email}
                  </Typography>
                </div>
                <Button variant="contained" color="primary" size="small" onClick={() => handleUnblock(user._id)}>
                  Unblock
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500">No blocked users.</p>
        )}
      </div>
    </div>
  );
};

export default BlockList;
