import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';

function Header(props) {
    const { toggleDrawer } = props;
    const [name, setName] = React.useState("G");

    React.useEffect(() => {
        if (props.loggedIn) {
            setName(localStorage.getItem("name"));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (props.loggedIn) {
            setName(localStorage.getItem("name"));
        }
    }, [props.loggedIn]);

    return (
        <React.Fragment>
            <AppBar color="primary" position="sticky" elevation={0} sx={{ p: 1 }} id="myHead">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={toggleDrawer}
                        edge="start"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Grid container spacing={1} alignItems="center">
                        <Grid sx={{ display: { sm: 'none', xs: 'block' } }} item>

                        </Grid>
                        <Grid item xs />
                        <Grid item>
                            <IconButton color="inherit" sx={{ p: 0.5 }}>
                                {/* <Avatar src={logo} alt="My Avatar" /> */}
                                <Avatar>{name ? name[0] : 'G'}</Avatar>
                            </IconButton>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

Header.propTypes = {
    toggleDrawer: PropTypes.func.isRequired,
};

export default Header;