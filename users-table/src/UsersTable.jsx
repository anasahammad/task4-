import { useContext, useEffect, useState } from "react"
import {  useNavigate } from "react-router-dom"
import { AuthContext } from "./Provider/AuthProvider"
import axios from "axios"
import Swal from "sweetalert2"


function UsersTable() {

  const {setUser, user} = useContext(AuthContext)
  const navigate = useNavigate()
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  
  useEffect(() => {
    // Fetch all users when the component loads
    axios.get(`${import.meta.env.VITE_BASE_URL}/users`)
      .then(response => setUsers(response.data))
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  
const handleLogout = ()=>{
  localStorage.removeItem('token')
  
  navigate("/")
  setUser(null)
}

const handleSelectUser = (id) => {
  if (selectedUsers.includes(id)) {
    setSelectedUsers(selectedUsers.filter(userId => userId !== id));
  } else {
    setSelectedUsers([...selectedUsers, id]);
  }
};

const handleSelectAll = () => {
  if (selectedUsers.length === users.length) {
    setSelectedUsers([]); 
  } else {
    setSelectedUsers(users.map(user => user._id)); 
  }
};

const handleDeleteUsers = () => {
  axios.delete(`${import.meta.env.VITE_BASE_URL}/delete-users`, { data: { ids: selectedUsers } })
    .then(() => {
      setUsers(users.filter(user => !selectedUsers.includes(user._id)));
      setSelectedUsers([]);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "User Deleted Successful",
        showConfirmButton: false,
        timer: 1500,
      });

    })
    .catch(error => console.error("Error deleting users:", error));
};

const handleBlockUsers = () => {
  axios.put(`${import.meta.env.VITE_BASE_URL}/block`, { ids: selectedUsers })
    .then(() => {
      setUsers(users.map(user => selectedUsers.includes(user._id) ? { ...user, status: 'blocked' } : user));
      setSelectedUsers([]);
    })
    .catch(error => console.error("Error blocking users:", error));
};

const handleUnblockUsers = () => {
  axios.put(`${import.meta.env.VITE_BASE_URL}/unblock`, { ids: selectedUsers })
    .then(() => {
      setUsers(users.map(user => selectedUsers.includes(user._id) ? { ...user, status: 'active' } : user));
      setSelectedUsers([]);
    })
    .catch(error => console.error("Error unblocking users:", error));
};
  return (
    <div className="container mx-auto py-12">
      
      <div className="flex justify-end items-center">
        <button onClick={handleLogout} className="px-4 py-2 bg-purple-500 text-white rounded-md">Logout</button>
       
      </div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

<div className="mb-4 flex gap-3">
  <button onClick={handleBlockUsers}  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" >
    Block
  </button>
  <button onClick={handleUnblockUsers} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" >
    Unblock
  </button>
  <button  onClick={handleDeleteUsers} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" >
    Delete
  </button>
</div>

<div className="overflow-x-auto">
  <table className="min-w-full table-auto border-collapse">
    <thead>
      <tr className="bg-gray-200 text-left">
        <th className="px-4 py-2">
          <input 
            type="checkbox" 
            onChange={handleSelectAll}
            checked={selectedUsers.length === users.length}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </th>
        <th className="px-4 py-2">ID</th>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">Email</th>
        <th className="px-4 py-2">Last Login</th>
        <th className="px-4 py-2">Registration Time</th>
        <th className="px-4 py-2">Status</th>
      </tr>
    </thead>
    <tbody>
      {users.map(user => (
        <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
          <td className="px-4 py-2">
            <input
              type="checkbox"
              checked={selectedUsers.includes(user._id)}
              onChange={() => handleSelectUser(user._id)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
          </td>
          <td className="px-4 py-2">{user._id}</td>
          <td className="px-4 py-2">{user.name}</td>
          <td className="px-4 py-2">{user.email}</td>
          <td className="px-4 py-2">{new Date(user.lastLoginTime).toLocaleString()}</td>
          <td className="px-4 py-2">{new Date(user.registrationTime).toLocaleString() || 'N/A'}</td>
          <td className="px-4 py-2">{user.status}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
    </div>
  )
}

export default UsersTable;
