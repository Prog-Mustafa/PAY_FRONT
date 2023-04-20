import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import Snackbar from "@mui/material/Snackbar";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "./login.css";

function SignIn(props) {
  const [error, setError] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const handleToggle = (state) => {
    setOpen(state);
  };
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    handleToggle(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      cred: data.get("cred"),
      password: data.get("password"),
    });
    API.post("user/login", data)
      .then((response) => {
        console.log(response);
        if (response.data) {
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.result.name);
          localStorage.setItem("num", response.data.result.num);
          localStorage.setItem("dep", response.data.result.dep.name);
          localStorage.setItem("logo", response.data.result.dep.logo);
          localStorage.setItem("account_type", response.data.result.role);
          handleToggle(false);
          props.setLoggedIn(true);
          navigate("/");
        }
      })
      .catch((err) => {
        handleToggle(false);
        setError(err);
      });
  };

  return (
    <div className="bg">
      <Container component="main" maxWidth="xs" className="loginMAin">
        <CssBaseline />
        <div className="center-form">
          <Box
            className="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* <Avatar sx={{ m: 1, bgcolor: 'primary' }}>
                    <LockOutlinedIcon />
                </Avatar> */}
            <Typography
              component="h1"
              variant="h4"
              sx={{ fontSize: "26px", fontWeight: "bold", color: "grey",pt:2,pb:2 }}
            >
              تسجيل الدخول
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
              id="log-form"
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="cred"
                placeholder="رقم الموظف"
                name="cred"
                autoComplete="cred"
                autoFocus
                className="inputt"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                placeholder="كلمة المرور"
                type="password"
                id="password"
                autoComplete="current-password"
                className="inputt"
              />
              {/* <FormControlLabel
                control={<Checkbox value="remember" />}
                label="تذكرني"
              /> */}
              <Button
                className="btn"
                type="submit"
                fullWidth
                variant="contained"
                
                sx={{ mt: 3, mb: 2, p: 1 ,fontSize:"18px"}}
              >
                تسجيل
              </Button>
            </Box>
          </Box>
          <Snackbar
          className="errMasg"
            open={error}
            autoHideDuration={2000}
            onClose={() => setError(null)}
            message="الاسم او كلمة المرور خاطئة"
          />
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
        </div>
      </Container>
    </div>
  );
}

export default SignIn;
