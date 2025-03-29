import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  TextField,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../config";
import UserEditDialog from "../common/dialogs/UserEditDialog";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const toggleEditDialog = (user) => {
    setSelectedUser({ ...user });
    setOpenEditDialog(prev => !prev);
  };

  const fetchUsers = async (pageNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/api/users?page=${pageNumber}`);
      setUsers(response.data.data);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${BASE_URL}/api/users/${selectedUser.id}`, selectedUser);
      setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)));
      setOpenEditDialog(false);
    } catch (err) {
      alert("Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return sortOrder === "asc"
      ? a.first_name.localeCompare(b.first_name)
      : b.first_name.localeCompare(a.first_name);
  });

  return (
    <Container>
      <h2>Welcome to Users Page!</h2>
      <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ mb: 2 }}>
        Logout
      </Button>
      <Box sx={{ display: "flex", justifyContent: "space-beetween",gap:1 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

<FormControl sx={{ mb: 2, width: "100%" }} variant="outlined">
  <InputLabel shrink={true}>Sort Order</InputLabel>
  <Select
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value)}
    label="Sort Order"
  >
    <MenuItem value="asc">Ascending</MenuItem>
    <MenuItem value="desc">Descending</MenuItem>
  </Select>
</FormControl>


      </Box>


      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Avatar</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Last Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <img src={user.avatar} alt="Avatar" width="50" height="50" />
                  </TableCell>
                  <TableCell>{user.first_name}</TableCell>
                  <TableCell>{user.last_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => toggleEditDialog(user)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
      />

      <UserEditDialog
        open={openEditDialog}
        toggle={toggleEditDialog}
        selectedUser={selectedUser}
        handleEditSubmit={handleEditSubmit}
        handleEditChange={handleEditChange}
      />
    </Container>
  );
};

export default Users;
