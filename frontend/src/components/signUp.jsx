import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AuthContext } from "../contexts/AuthContext";
import Snackbar from "@mui/material/Snackbar";
import Swal from "sweetalert2"; // Import SweetAlert2 for better alerts

const defaultTheme = createTheme();

export default function Authentication() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [formState, setFormState] = React.useState(0); // 0 = Login, 1 = Register
  const [open, setOpen] = React.useState(false);

  // Get authentication functions from context
  const authContext = React.useContext(AuthContext);
  const handleRegister = authContext?.handleRegister;
  const handleLogin = authContext?.handleLogin;

  // Ensure authentication functions exist
  if (!handleLogin || !handleRegister) {
    console.error(
      "Auth functions are missing! Make sure AuthContext.Provider wraps this component."
    );
  }

  // Handle Login or Registration
  const handleAuth = async () => {
    try {
      let result;
      if (formState === 0) {
        result = await handleLogin(username, password);
      } else {
        result = await handleRegister(name, username, password);
        setMessage("Registration successful! You can now log in.");
        setOpen(true);
        setFormState(0); // Switch to login form after successful registration
        setUsername("");
        setPassword("");
        setName("");
      }

      // Show success alert
      Swal.fire({
        title: "Success!",
        text:
          formState === 0 ? "Login successful!" : "Registration successful!",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#28a745",
      });
    } catch (err) {
      console.error("Authentication error:", err);

      // Extract error message safely
      let errorMessage =
        err.response?.data?.message || "An error occurred. Please try again.";

      setError(errorMessage);

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        {/* Left Side Image */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://media.istockphoto.com/id/1289448586/photo/cheering-online-with-my-best-friend.jpg?s=612x612&w=0&k=20&c=pvXBYAKJHtvowZqZSgtZR44SvmaUrC2vgz9uSPKoxRw=)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Authentication Form */}
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            {/* Sign In / Sign Up Toggle Buttons */}
            <div>
              <Button
                variant={formState === 0 ? "contained" : ""}
                onClick={() => setFormState(0)}>
                Sign In
              </Button>
              <Button
                variant={formState === 1 ? "contained" : ""}
                onClick={() => setFormState(1)}>
                Sign Up
              </Button>
            </div>

            {/* Authentication Form */}
            <Box component="form" noValidate sx={{ mt: 1 }}>
              {formState === 1 && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="fullname"
                  label="Full Name"
                  name="fullname"
                  value={name}
                  autoFocus
                  onChange={(e) => setName(e.target.value)}
                />
              )}

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                value={username}
                autoFocus
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                id="password"
              />

              {/* Display error messages */}
              {error && (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
              )}

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleAuth}>
                {formState === 0 ? "Login" : "Register"}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Snackbar for success messages */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={message}
        onClose={() => setOpen(false)}
      />
    </ThemeProvider>
  );
}
