import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import api from '../../api';
import { toast } from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Error fetching users');
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreateAdmin = async () => {
    try {
      await api.post('/users/admin', form);
      toast.success('Admin created');
      setOpen(false);
      setForm({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating admin');
    }
  };

  const handlePromote = async (id) => {
    try {
      await api.put(`/users/${id}/promote`);
      toast.success('User promoted to admin');
      fetchUsers();
    } catch (err) {
      toast.error('Error promoting user');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Users</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Admin</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell>{u.firstName} {u.lastName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.phoneNumber}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  {u.role !== 'admin' && (
                    <Button variant="outlined" onClick={() => handlePromote(u._id)}>Promote</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create Admin</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Email" name="email" value={form.email} onChange={handleChange} required /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Password" name="password" value={form.password} onChange={handleChange} required type="password" /></Grid>
            <Grid item xs={12}><TextField fullWidth label="Phone Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateAdmin}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
