import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../components/ui';
import { Toaster, toast } from 'sonner';
import Sidebar from './Sidebar';

interface User {
  id: number;
  name: string;
  email: string;
  banned: number;
  uuid: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const uuid = "s9dBDmERh9hA2WX1M2vrVZdZ3Um1";
  const authToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwYjIyMWFiNjU2MTdiY2Y4N2VlMGY4NDYyZjc0ZTM2NTIyY2EyZTQiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiR29rdWwgMjJCQ0UyOTQ1IiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0t0UVBQSV9XRnIzZXFfaFF3cndSSzRCQ0RpcHM3Mk9qaEVaenVSYURzZ0tZdHFqZz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9wMnBtYXJ0LTExOTMxIiwiYXVkIjoicDJwbWFydC0xMTkzMSIsImF1dGhfdGltZSI6MTc0MjkyMjAxMCwidXNlcl9pZCI6InM5ZEJEbUVSaDloQTJXWDFNMnZyVlpkWjNVbTEiLCJzdWIiOiJzOWRCRG1FUmg5aEEyV1gxTTJ2clZaZFozVW0xIiwiaWF0IjoxNzQyOTIyMDEwLCJleHAiOjE3NDI5MjU2MTAsImVtYWlsIjoiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTU5MTIxMzUyNDQzNDU3MzM3MDMiXSwiZW1haWwiOlsiZ29rdWwuMjAyMkB2aXRzdHVkZW50LmFjLmluIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.tW9ebvaGOsXB46nl9QbYlJr1jejY4Yc37U3DCHTbObgoNlpn5fZ1ZLOIGRmQ9Ipd9OxzfLcWovGBUl9WgsBmZhl5iLlwfQRQ0TOBx7X-V7EcURcoZC-qAQvGdZ5ROnRcyegY_9JEw9ixKjIl1r_10s1hRPXjpD1t7EFKoMOvkGk2SfJIJ1k-X6QxFJmah2b9JApjgj7wNkEEFbjxR1_bPpAC_yNxEgRH9uSWDI3C1rfImksliPKaZn06HCDdOqXoC9Z26cuqskl8rYFSaO0HjkoCPjRJ4VY_rTx7ufwCLS_c1sNosna2hmanwQwPBgKOjCOdhxT4ArGPrBT2RoTXVg";

  useEffect(() => {
    axios.get('https://peer2peermart-y0wq.onrender.com/admin/getAllUsers', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      params: {
        user_id: uuid
      }
    })
      .then(response => setUsers(response.data.data))
      .catch(error => console.error(error));
  }, []);

  const handleBlock = (userUuid: string) => {
    axios.put(`https://peer2peermart-y0wq.onrender.com/admin/banUser`, null, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      params: { userId: userUuid }
    })
      .then(() => {
        setUsers(users.map(user => user.uuid === userUuid ? { ...user, banned: 1 } : user));
        toast.success('User banned successfully');
      })
      .catch(error => console.error(error));
  };

  const handleUnblock = (userUuid: string) => {
    axios.put(`https://peer2peermart-y0wq.onrender.com/admin/unBanUser`, null, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`
      },
      params: { userId: userUuid }
    })
      .then(() => {
        setUsers(users.map(user => user.uuid === userUuid ? { ...user, banned: 0 } : user));
        toast.success('User unbanned successfully');
      })
      .catch(error => console.error(error));
  };

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
          <ul className="divide-y divide-gray-200">
            {users.map(user => (
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
