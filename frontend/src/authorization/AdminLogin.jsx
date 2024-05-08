import { useContext, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GeneralContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { RoleTypes } from '../components/Navbar';
import Joi from 'joi';
import Footer from '../components/Footer';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setUser, setLoader, setUserRoleType, mode, setOpen, setSnackbarMsg } = useContext(GeneralContext);
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

    const schema = Joi.object({
        email: Joi.string().email({ tlds: false }).required(),
        password: Joi.string().required()
    })

    const handleInput = ev => {
        const { name, value } = ev.target;

        const obj = { ...formData, [name]: value };
        setFormData(obj);

        const validate = schema.validate(obj, { abortEarly: false });
        const tempErrors = { ...errors };
        delete tempErrors[name];

        if (validate.error) {
            const item = validate.error.details.find(e => e.context.key === name);

            if (item) {
                tempErrors[name] = item.message;
            }
        }

        setIsFormValid(!validate.error);
        setErrors(tempErrors);
    }

    const login = async ev => {
        ev.preventDefault();
        setLoader(true);

        try {
            const res = await fetch("http://localhost:1907/onlyAdmin/login", {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });

            if (!res.ok) {
                throw new Error('Failed to login');
            }

            const data = await res.text();
            localStorage.token = data;

            const res2 = await fetch("http://localhost:1907/onlyAdmin/me", {
                credentials: 'include',
                headers: {
                    'Authorization': localStorage.token,
                },
            });

            if (!res2.ok) {
                throw new Error('User not authorized');
            }

            const user = await res2.json();
            setUser(user);
            if (user.isMaster === true) {
                setUserRoleType(RoleTypes.master);
            } else {
                setUserRoleType(RoleTypes.admin);
            }
            setOpen(true);
            setSnackbarMsg("התחברת בהצלחה!");
            navigate('/');
        } catch (error) {
            console.error("Login error:", error.message);
            setErrorMessage("אימייל או סיסמא שגויים");
        } finally {
            setLoader(false);
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ animation: `${fadeIn} 0.5s ease-in-out`, }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">התחברות</Typography>
                    {errorMessage && (
                        <Typography color="error" variant="body2">{errorMessage}</Typography>
                    )}
                    <Box component="form" onSubmit={login} noValidate sx={{ mt: 1 }}>
                        <TextField
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="אימייל"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={handleInput}
                            value={formData.email}
                        />
                        <TextField
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="סיסמא"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={handleInput}
                            value={formData.password}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!isFormValid}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            התחבר
                        </Button>
                        <Grid container justifyContent="center">
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Footer />
        </ThemeProvider>
    )
}
