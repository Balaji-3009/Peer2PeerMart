import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';

interface User {
  id: number;
  name: string;
  email: string;
  blocked: boolean;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get('https://peer2peermart-y0wq.onrender.com/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleBlock = (userId: number) => {
    axios.put(`https://peer2peermart-y0wq.onrender.com/users/block/${userId}`)
      .then(() => setUsers(users.map(user => user.id === userId ? { ...user, blocked: true } : user)))
      .catch(error => console.error(error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {users.map(user => (
              <li key={user.id} className="py-4 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                {user.blocked ? (
                  <span className="text-red-500">Blocked</span>
                ) : (
                  <Button variant="destructive" onClick={() => handleBlock(user.id)}>Block</Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default Users;
