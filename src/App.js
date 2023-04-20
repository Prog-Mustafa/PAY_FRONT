import * as React from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/login/SignIn";
import Users from "./pages/users/Users";
import Salaries from "./pages/salaries/Salaries";
import Home from "./pages/home/Home";
import Deps from "./pages/deps/Deps";
import AllSalaries from "./pages/allSalaries/Salaries";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Navigator from './components/navbar/Navigation';
import Header from './components/navbar/Header';
import { useNavigate } from "react-router-dom";
import "./App.css";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  );
}

let theme = createTheme({
 
  palette: {
    primary: {
      // light: '#63ccff',
      // main: '#009be5',
      // dark: '#006db3',
      main: '#7158e2'
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#3d3d3d',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
        contained: {
          boxShadow: 'none',
          '&:active': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          margin: '0 16px',
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up('md')]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(255,255,255,0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: '#4fc3f7',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
          minWidth: 'auto',
          marginRight: theme.spacing(2),
          '& svg': {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

export default function Paperbase() {
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [drawer, setDrawer] = React.useState(!isSmUp);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = React.useState(
    localStorage.getItem("loggedIn") ? true : false
  );

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("account_type");
    localStorage.removeItem("dep");
    localStorage.removeItem("logo");
    setLoggedIn(false);
    console.log("hey");
  };

  const toggleDrawer = () => {
    console.log(drawer)
    setDrawer(!drawer);
  };

  React.useEffect(() => {
    if (!loggedIn)
      navigate("/login");
    console.log(loggedIn);
  }, [loggedIn, navigate]);


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {loggedIn ? <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              setLoggedIn={setLoggedIn} logout={logout} {...{ loggedIn }}
              PaperProps={{ style: { width: drawerWidth }, open: drawer }}
              variant="temporary"
              open={drawer}
              onClose={toggleDrawer}
            />
          )}
          <Navigator
            setLoggedIn={setLoggedIn} logout={logout} {...{ loggedIn }}
            PaperProps={{ style: { width: drawerWidth }, open: drawer }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
            open={drawer}
            onClose={toggleDrawer}
          />
        </Box> : null}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {loggedIn ? <Header setLoggedIn={setLoggedIn} logout={logout} toggleDrawer={toggleDrawer}  {...{ loggedIn }} /> : null}
          <Box component="main" sx={{ flex: 1, py: 6, px: 2, bgcolor: '#eaeff1' }}>
            {/* <Content /> */}
            <Routes>
              <Route
                path="/login"
                element={<SignIn setLoggedIn={setLoggedIn} logout={logout} />}
              />
              <Route
                path="/users"
                element={<Users setLoggedIn={setLoggedIn} logout={logout} />}
              />
              <Route
                path="/deps"
                element={<Deps setLoggedIn={setLoggedIn} logout={logout} />}
              />
              <Route
                path="/salaries"
                element={<AllSalaries setLoggedIn={setLoggedIn} logout={logout} />}
              />
              <Route
                path="/users/:id"
                element={<Salaries setLoggedIn={setLoggedIn} logout={logout} />}
              />
              <Route
                path="/"
                element={<Home setLoggedIn={setLoggedIn} logout={logout} />}
              />
            </Routes>
          </Box>
          <Box component="footer" sx={{ p: 3, bgcolor: '#eaeff1' }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// export default App;
