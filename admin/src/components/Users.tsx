import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import { Toaster, toast } from 'sonner';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  email: string;
  banned: number;
  uuid: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem("uuid") || "";
  const authToken = localStorage.getItem("idToken") || "";

  useEffect(() => {
    if (!userId || !authToken) {
      navigate("/login");
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://peer2peermart-y0wq.onrender.com/admin/getAllUsers', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        params: {
          user_id: userId
        }
      });
      setUsers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async (userUuid: string) => {
    try {
      await axios.put(`https://peer2peermart-y0wq.onrender.com/admin/banUser`, null, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        params: { userId: userUuid }
      });
      setUsers(users.map(user => user.uuid === userUuid ? { ...user, banned: 1 } : user));
      toast.success('User banned successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnblock = async (userUuid: string) => {
    try {
      await axios.put(`https://peer2peermart-y0wq.onrender.com/admin/unBanUser`, null, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        params: { userId: userUuid }
      });
      setUsers(users.map(user => user.uuid === userUuid ? { ...user, banned: 0 } : user));
      toast.success('User unbanned successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Sidebar />
      <div className="m-12 min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <Toaster richColors position="top-right" />
        <Card className="w-full max-w-4xl">
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4 p-2 border border-gray-300 rounded w-full"
            />
            <ul className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <li key={user.id} className="py-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                  {user.banned ? (
                    <Button variant="default" onClick={() => handleUnblock(user.uuid)}>Unblock</Button>
                  ) : (
                    <Button variant="destructive" onClick={() => handleBlock(user.uuid)}>Block</Button>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Users;
