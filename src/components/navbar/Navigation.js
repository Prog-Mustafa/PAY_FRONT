import * as React from 'react';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PaidIcon from '@mui/icons-material/Paid';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import UpdateUserPass from '../updateUserPass/updateUserPass'
import PhonelinkSetupIcon from '@mui/icons-material/PhonelinkSetup';
import Avatar from '@mui/material/Avatar';

const categories = [
    {
        id: 'معلومات المستخدم',
        children: [
            {
                id: 'تسجيل الخروج',
                icon: <LogoutIcon />,
                active: false,
                ssuper: false,
                admin: false
            },
            {
                id: 'تغير كلمة المرور',
                icon: <SettingsIcon />,
                active: false,
                ssuper: false,
                admin: false
            },
        ],
    },
    {
        id: 'البيانات',
        children: [
            { id: 'الموظفين', icon: <PeopleIcon />, route: "/users", ssuper: false, admin: true },
            { id: 'الرواتب', icon: <PaidIcon />, route: "/salaries", ssuper: false, admin: true },
            { id: 'القسم', icon: <PhonelinkSetupIcon />, route: "/deps", ssuper: true, admin: true },
        ],
    },
];

const item = {
    py: '2px',
    px: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    '&:hover, &:focus': {
        bgcolor: 'rgba(255, 255, 255, 0.08)',
    },
};

const itemCategory = {
    boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
    py: 1.5,
    px: 3,
};

export default function Navigator(props) {
    const { ...other } = props;
    const [role, setRole] = React.useState(false);
    const [logo, setLogo] = React.useState(null);
    const [dep, setDep] = React.useState(null);
    const num = localStorage.getItem("num");
    const isSuper = role === "SUPER";
    const isAdmin = role === "ADMIN";
    const isRead = role === 'READ';
    const navigate = useNavigate();
    const [openUpdatePassForm, setOpenUpdatePassForm] = React.useState(false);
    const handleOpenUpdatePassForm = () => setOpenUpdatePassForm(true);
    const handleCloseUpdatePassForm = () => {
        setOpenUpdatePassForm(false)
    };

    const updateUserPassByID = async (id) => {
        handleOpenUpdatePassForm()
    }

    React.useEffect(() => {
        if (props.loggedIn) {
            setRole(localStorage.getItem("account_type"));
            setLogo(localStorage.getItem("logo"));
            setDep(localStorage.getItem("dep"));
        } else {
            navigate("/login");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (props.loggedIn) {
            setRole(localStorage.getItem("account_type"));
            setLogo(localStorage.getItem("logo"));
            setDep(localStorage.getItem("dep"));
        } else {
            navigate("/login");
        }
    }, [props.loggedIn, navigate]);

    const changeRoute = (route) => {
        navigate(route);
    };

    return (
        <Drawer variant="permanent" {...other}>
            <List disablePadding>
                <ListItem sx={{ ...item, ...itemCategory, fontSize: 14, color: '#fff' }}>
                    <Avatar src={logo} alt="My Avatar" sx={{ mr: 2, width: "20px", height: "20px" }} />
                    {dep}
                </ListItem>
                <UpdateUserPass {...{ id: num, getData: null, setError: null, openUpdatePassForm, handleCloseUpdatePassForm, logout: props.logout }} />
                <ListItem disablePadding sx={{ ...item, ...itemCategory, cursor: 'pointer' }} onClick={() => { changeRoute('/') }}>
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                    <ListItemText>الصفحة الرئيسية</ListItemText>
                </ListItem>
                {categories.map(({ id, children }) => (
                    <Box key={id} sx={{ bgcolor: '#363535' }}>
                        <ListItem sx={{ py: 2, px: 3 }}>
                            <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
                        </ListItem>
                        {children.map(({ id: childId, icon, active, route, ssuper, admin }) => (
                            (((isSuper || isRead) === ssuper || ssuper === false) && ((isSuper || isAdmin || isRead) === admin || admin === false))
                                ? <ListItem disablePadding key={childId} onClick={() => {
                                    route ? changeRoute(route) : (childId === 'تسجيل الخروج' ? props.logout() : updateUserPassByID(num))
                                }}>
                                    <ListItemButton selected={active} sx={item}>
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText>{childId}</ListItemText>
                                    </ListItemButton>
                                </ListItem> : null
                        ))}

                        <Divider sx={{ mt: 2 }} />
                    </Box>
                ))}
            </List>
        </Drawer>
    );
}