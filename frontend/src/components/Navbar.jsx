import { useState, useContext } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import { Link, useNavigate, useResolvedPath } from 'react-router-dom';
import { GeneralContext } from '../App';
import { DarkMode } from './DarkMode';
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from "@emotion/react";


export const RoleTypes = {
    customer: 0,
    admin: 1,
    master: 2,
};

export const checkPermissions = (permissions, userRoleType) => {
    return permissions.includes(userRoleType);
}





const pages = [
    { route: '/about', title: 'אודות' },
    { route: '/plumbers', title: 'בעלי מקצוע' },
    { route: '/plumber/new', title: 'הוספת בעל מקצוע', permissions: [RoleTypes.master, RoleTypes.admin] },
    { route: '/opinions/new', title: 'הוספת חוות דעת' },
    { route: '/onlyAdmin/signup', title: 'רישום מנהל חדש', permissions: [RoleTypes.master] },
    { route: '/onlyAdmin/login', title: 'התחברות למנהלים', permissions: [RoleTypes.customer] }
];

export default function Navbar() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const { user, setUser, setLoader, userRoleType, setUserRoleType } = useContext(GeneralContext);
    const navigate = useNavigate();
    const { mode } = useContext(GeneralContext);
    const path = useResolvedPath().pathname;

    const theme = createTheme({
        palette: {
            primary: {
                light: '#b3e5fc',
                main: '#4fc3f7',
                dark: '#0277bd',
                contrastText: '#000',
            },
            secondary: {
                main: '#004d40',
            },
            mode: mode,
        },
    });

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        setLoader(true);
        localStorage.removeItem('token');
        setUser(null);
        setUserRoleType(RoleTypes.customer);
        setLoader(false);
        navigate('/');
        handleCloseUserMenu();
    }


    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <CssBaseline />
                    <Toolbar disableGutters>
                        <PlumbingIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <Link style={{ textDecoration: 'none', color: 'inherit' }} to={'/'}>
                                לינק שרברבים</Link>
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.filter(p => !p.permissions || checkPermissions(p.permissions, userRoleType)).map(p => (
                                    <Link key={p.route} to={p.route} style={{ textDecoration: 'none', color: 'primary.main' }}>
                                        <MenuItem onClick={handleCloseNavMenu}>
                                            <Typography color='primary.main' textAlign="center">{p.title}</Typography>
                                        </MenuItem>
                                    </Link>
                                ))}
                            </Menu>
                        </Box>
                        <PlumbingIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            <b>לינק שרברבים</b>
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.filter(p => !p.permissions || checkPermissions(p.permissions, userRoleType)).map(p => (
                                <Link key={p.route} to={p.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <Button
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            my: 2, color: 'inherit', display: 'block',
                                            backgroundColor: p.route === path ? 'primary.dark' : ''
                                        }}
                                    >
                                        {p.title}
                                    </Button>
                                </Link>
                            ))}
                        </Box>




                        <DarkMode />
                        {

                            user ?
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt={user.name.first} src="/static/images/avatar/2.jpg" />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >


                                        <MenuItem onClick={logout}>
                                            <Typography textAlign="center">התנתק</Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box> :
                                ''
                        }
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider >
    );
}