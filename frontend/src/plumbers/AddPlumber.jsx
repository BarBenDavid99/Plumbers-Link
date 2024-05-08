import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../App';
import Joi from 'joi';
import { useState, useContext, useEffect } from 'react';
import { RoleTypes } from '../components/Navbar';
import ServiceAreaSelect from '../components/ServiceArea';
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

export const hebrewMessages = {
    'string.base': `שדה זה חייב להיות טקסט`,
    'string.empty': `שדה זה לא יכול להיות ריק`,
    'string.min': `אנא הזן שדה תקין`,
    'any.required': `שדה זה הינו שדה חובה `
}
export const plumberStructure = [
    { name: 'first', type: 'text', label: 'שם פרטי', block: false },
    { name: 'last', type: 'text', label: 'שם משפחה', block: false },
    { name: 'bizName', type: 'text', label: 'שם העסק', block: false },
    { name: 'profession', type: 'text', label: 'מקצוע', block: false },
    { name: 'phone', type: 'tel', label: 'מספר נייד', block: false },
    // { name: 'description', type: 'text', label: 'תיאור', block: true },
    { name: 'email', type: 'email', label: 'אימייל', block: true },
    { name: 'url', type: 'text', label: 'תמונה', block: true },
    { name: 'alt', type: 'text', label: 'תמונה משנית', block: false },
    { name: 'city', type: 'text', label: 'עיר', block: false },
    { name: 'street', type: 'text', label: 'רחוב', block: false },
    { name: 'houseNumber', type: 'number', label: 'מספר בית', block: false },
    { name: 'zip', type: 'number', label: 'מיקוד', block: false },
    { name: 'bizNumber', type: 'number', label: 'מספר בית עסק', block: false }
]

export default function AddPlumber() {
    const [formData, setFormData] = useState({
        name: { first: '', last: '' },
        bizName: '',
        profession: '',
        phone: '',
        description: '',

        email: '',
        image: { url: '', alt: '' },
        address: {
            city: '',
            street: '',
            houseNumber: '',
            zip: ''
        },
        serviceArea: [],
        bizNumber: '',
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
        if (userRoleType === RoleTypes.customer) {
            navigate('/');
        }
    }, [userRoleType, navigate]);

    const schema = Joi.object({
        name: Joi.object({
            first: Joi.string().min(2).required().messages(hebrewMessages),
            last: Joi.string().min(2).required().messages(hebrewMessages),
        }).required(),
        bizName: Joi.string().min(2).max(20).required().messages(hebrewMessages),
        profession: Joi.string().min(2).max(20).required().messages(hebrewMessages),
        phone: Joi.string().min(10).max(15).required().messages(hebrewMessages),
        description: Joi.string().min(2).max(100).required().messages(hebrewMessages),
        email: Joi.string().email({ tlds: false }).required(),
        image: Joi.object({
            url: Joi.string().min(2).max(10000).required().messages(hebrewMessages),
            alt: Joi.string().min(2).max(1000).required().messages(hebrewMessages),
        }).required(),
        address: Joi.object({
            city: Joi.string().min(2).max(100).required().messages(hebrewMessages),
            street: Joi.string().min(2).max(100).required().messages(hebrewMessages),
            houseNumber: Joi.number().required().messages(hebrewMessages),
            zip: Joi.number().required().messages(hebrewMessages),
        }).required(),
        serviceArea: Joi.array().required().messages(hebrewMessages),
        bizNumber: Joi.number().required().messages(hebrewMessages),
    })
    const handleInput = (ev, { name: inputName, value }) => {
        if (ev && ev.target) {
            const { name } = ev.target;
            console.log("Name:", name);
            let obj = { ...formData };

            if (name === 'first' || name === 'last') {
                obj = {
                    ...formData,
                    name: {
                        ...formData.name,
                        [name]: value
                    }
                };
            } else if (name === 'url' || name === 'alt') {
                obj = {
                    ...formData,
                    image: {
                        ...formData.image,
                        [name]: value
                    }
                };
            } else if (name === 'city' || name === 'street' || name === 'houseNumber' || name === 'zip') {
                obj = {
                    ...formData,
                    address: {
                        ...formData.address,
                        [name]: value
                    }
                };
            } else if (name === 'serviceArea') {
                obj = {
                    ...formData,
                    serviceArea: [...formData.serviceArea, value]
                };
            } else {
                obj = { ...formData, [name]: value };
            }

            setFormData(obj);

            const validate = schema.validate(obj, { abortEarly: false });
            console.log("Validation result:", validate);


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
    };

    const addPlumber = ev => {
        ev.preventDefault();

        const elements = ev.target.elements;
        const obj = {
            name: {
                first: elements['first'].value,
                last: elements['last'].value
            },
            bizName: elements['bizName'].value,
            profession: elements['profession'].value,
            phone: elements['phone'].value,
            description: elements['description'].value,
            email: elements['email'].value,
            image: {
                url: elements['url'].value,
                alt: elements['alt'].value
            },
            address: {
                city: elements['city'].value,
                street: elements['street'].value,
                houseNumber: elements['houseNumber'].value,
                zip: elements['zip'].value,
            },
            serviceArea: elements['serviceArea'] && elements['serviceArea'].value !== '' ? elements['serviceArea'].value : [],
            bizNumber: elements['bizNumber'].value
        };


        setLoader(true);


        fetch(`http://localhost:1907/plumbers`, {
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
            .then(() => {
                navigate('/');
                setLoader(false);
                setOpen(true);
                setSnackbarMsg("נוצר בעל מקצוע חדש");
            })
            .catch(err => {
                alert(err.message);
                setLoader(false);
            });
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{
                animation: `${fadeIn} 0.5s ease-in-out`
            }}>
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
                    </Avatar>
                    <Typography component="h1" variant="h5"  >הוספת בעל מקצוע חדש</Typography>
                    <Box component="form" onSubmit={addPlumber} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            {
                                plumberStructure.map(t =>
                                    <Grid key={t.name} item xs={12} sm={t.block ? 12 : 6}>
                                        {
                                            <TextField
                                                error={Boolean(errors[t.name])}
                                                helperText={errors[t.name]}
                                                margin="normal"
                                                required
                                                fullWidth
                                                id={t.name}
                                                label={t.label}
                                                name={t.name}
                                                type={t.type}
                                                autoComplete={t.name}
                                                onChange={(ev) => handleInput(ev, { name: t.name, value: ev.target.value })}

                                            />

                                        }
                                    </Grid>
                                )

                            }
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    error={Boolean(errors.description)}
                                    helperText={errors.description}
                                    margin="normal"
                                    fullWidth
                                    rows={4}
                                    id="outlined-multiline-static"
                                    multiline
                                    label="תיאור"
                                    name="description"
                                    type="text"
                                    autoComplete="description"
                                    onChange={(event) => handleInput(event, { name: 'description', value: event.target.value })}
                                />
                            </Grid>
                            <Grid key="serviceArea" item xs={12} sm={12}>
                                <ServiceAreaSelect
                                    id="serviceArea"
                                    name="serviceArea"
                                    value={formData.serviceArea}
                                    onChange={(event) => handleInput(event, { name: 'serviceArea', value: event.target.value })}
                                    error={Boolean(errors['serviceArea'])}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={!isFormValid}
                        >
                            הוסף
                        </Button>
                    </Box>
                </Box>
            </Container>

            <Footer />
        </ThemeProvider>
    );
}