import {
    Container,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid
} from "@mui/material";
import { useState } from "react";

const UserEditDialog = ({ open, toggle, selectedUser, handleEditChange, handleEditSubmit }) => {
    const [errors, setErrors] = useState({});

    const validate = () => {
        let tempErrors = {};
        if (!selectedUser?.first_name?.trim()) tempErrors.first_name = "First Name is required";
        if (!selectedUser?.last_name?.trim()) tempErrors.last_name = "Last Name is required";
        if (!selectedUser?.email?.trim()) {
            tempErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(selectedUser.email)) {
            tempErrors.email = "Invalid email format";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            handleEditSubmit();
        }
    };

    return (
        <Dialog open={open} onClose={toggle} fullWidth maxWidth="sm">
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent sx={{ overflow: "visible" }}>
                <Container>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="first_name"
                                value={selectedUser?.first_name || ""}
                                onChange={handleEditChange}
                                variant="outlined"
                                size="small"
                                error={!!errors.first_name}
                                helperText={errors.first_name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="last_name"
                                value={selectedUser?.last_name || ""}
                                onChange={handleEditChange}
                                variant="outlined"
                                size="small"
                                error={!!errors.last_name}
                                helperText={errors.last_name}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={selectedUser?.email || ""}
                                onChange={handleEditChange}
                                variant="outlined"
                                size="small"
                                error={!!errors.email}
                                helperText={errors.email}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggle}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserEditDialog;
