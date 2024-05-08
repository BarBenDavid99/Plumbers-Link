import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../App';
import Joi from 'joi';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Switch } from '@mui/material';
import { RoleTypes } from '../components/Navbar';
import Footer from '../components/Footer';
import { keyframes } from '@emotion/react';
import { hebrewMessages } from '../plumbers/AddPlumber';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const adminStructure = [
    { name: 'first', type: 'text', label: 'שם פרטי ', required: true },
    { name: 'last', type: 'text', label: 'שם משפחה ', required: true },
    { name: 'phone', type: 'tel', label: ' מספר נייד', required: true },
    { name: 'email', type: 'email', label: 'אימייל ', required: true },
    { name: 'password', type: 'password', label: 'סיסמא ', required: true, initialOnly: true },
]

export default function AdminSignup() {

    const [formData, setFormData] = useState({
        name: { first: '', last: '' },
        phone: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const { setLoader, mode, setOpen, setSnackbarMsg, userRoleType } = useContext(GeneralContext);
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

    useEffect(() => {
        if (userRoleType !== RoleTypes.master) {
            navigate('/');
        }
    }, [userRoleType, navigate]);

    const schema = Joi.object({
        name: Joi.object({
            first: Joi.string().required().messages(hebrewMessages),
            last: Joi.string().required().messages(hebrewMessages)
        }).required(),
        phone: Joi.number().required().messages(hebrewMessages),
        email: Joi.string().email({ tlds: false }).required(),
        password: Joi.string()
            .min(6)
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*'-])(?=.*\d).{6,}$/)
            .rule({
                message:
                    'הסיסמה חייבת להיות באורך שישה תווים לפחות ולהכיל אות גדולה, אות קטנה, מספר ואחד מהתווים הבאים: !@#$%^&*-\'.',
            })
    })

    const handleInput = ev => {
        const { name, value } = ev.target;
        let obj = { ...formData };

        if (name === 'first' || name === 'last') {
            obj = {
                ...formData,
                name: {
                    ...formData.name,
                    [name]: value
                }
            };
        } else {
            obj = { ...formData, [name]: value };
        }

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

    const signup = ev => {
        ev.preventDefault();


        const elements = ev.target.elements;
        const obj = {
            name: {
                first: elements['first'].value,
                last: elements['last'].value
            },
            phone: elements['phone'].value,
            email: elements['email'].value,
            password: elements['password'].value
        };

        setLoader(true);

        fetch(`http://localhost:1907/onlyAdmin/signup`, {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': localStorage.token,
            },
            body: JSON.stringify(obj),
        })
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    return res.text().then(x => {
                        throw new Error(x);
                    });
                }
            })
            .then(() => navigate('/'))
            .catch(err => alert(err.message))
            .finally(() => {
                setLoader(false);
                setOpen(true);
                setSnackbarMsg("נוצר מנהל חדש");
            });
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
                    <Typography component="h1" variant="h5">רישום מנהל חדש</Typography>
                    <Box component="form" onSubmit={signup} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            {
                                adminStructure.map(s =>
                                    <Grid key={s.name} item xs={12} sm={s.block ? 12 : 6}>
                                        {
                                            s.type === 'boolean' ?
                                                <FormControlLabel
                                                    control={<Switch color="primary" name={s.name} />}
                                                    label={s.label}
                                                    labelPlacement="start"
                                                /> :
                                                <TextField
                                                    error={Boolean(errors[s.name])}
                                                    helperText={errors[s.name]}
                                                    margin="normal"
                                                    required={s.required}
                                                    fullWidth
                                                    id={s.name}
                                                    label={s.label}
                                                    name={s.name}
                                                    type={s.type}
                                                    autoComplete={s.name}
                                                    onChange={handleInput}

                                                />
                                        }
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!isFormValid}
                        >
                            רישום
                        </Button>
                    </Box>
                </Box>
            </Container>
            <br /> <br /> <br /> <br />
            <Footer />
        </ThemeProvider>
    );
}