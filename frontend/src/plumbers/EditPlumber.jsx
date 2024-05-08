import { ThemeProvider } from "@emotion/react";
import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography, createTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hebrewMessages, plumberStructure } from "./AddPlumber";
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { GeneralContext } from "../App";
import Joi from "joi";
import { RoleTypes } from '../components/Navbar';
import ServiceAreaSelect from '../components/ServiceArea';
import Footer from "../components/Footer";
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;



export default function EditPlumber() {
    const { id } = useParams();
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

    useEffect(() => {
        setLoader(true);
        fetch(`http://localhost:1907/plumbers/${id}`, {
            credentials: 'include',
            headers: {
                'Authorization': localStorage.token,
            },
        })
            .then(res => res.json())
            .then(data => {
                setFormData(data);
            })
            .catch(error => {
                console.error('Error fetching plumber details:', error);
            })
            .finally(() => {
                setLoader(false);
            });
    }, [id, setLoader]);


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
            houseNumber: Joi.number().min(1).max(20).required().messages(hebrewMessages),
            zip: Joi.number().min(3).required().messages(hebrewMessages),
        }).required(),
        serviceArea: Joi.array().required().messages(hebrewMessages),
        bizNumber: Joi.number().required().messages(hebrewMessages),
    })

    const handleInput = (ev, { name: inputName, value }) => {
        if (ev && ev.target) {
            const { name } = ev.target;

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
            } else if (inputName === 'serviceArea') {
                obj = {
                    ...formData,
                    serviceArea: value
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
    };

    const save = ev => {
        ev.preventDefault();
        setLoader(true);
        fetch(`http://localhost:1907/plumbers/${formData._id}`, {
            credentials: 'include',
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'Authorization': localStorage.token,
            },
            body: JSON.stringify(formData),
        })
            .catch(error => {
                console.error(`Error updating plumbers's details`, error);
            })
            .finally(() => {
                setOpen(true);
                setSnackbarMsg("שרברב נערך בהצלחה")
                navigate('/plumbers')
                setLoader(false);
            });
    }

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs" sx={{ animation: `${fadeIn} 0.5s ease-in-out` }}>
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
                        <ModeEditIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">עריכת פרטי בעל מקצוע</Typography>
                    <Box component="form" onSubmit={save} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            {
                                plumberStructure.map(t => (
                                    <Grid key={t.name} item xs={12} sm={t.block ? 12 : 6}>
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
                                            value={
                                                t.name === 'first' ? formData.name.first :
                                                    t.name === 'last' ? formData.name.last :
                                                        t.name === 'url' ? formData.image.url :
                                                            t.name === 'alt' ? formData.image.alt :
                                                                t.name === 'city' ? formData.address.city :
                                                                    t.name === 'street' ? formData.address.street :
                                                                        t.name === 'houseNumber' ? formData.address.houseNumber :
                                                                            t.name === 'zip' ? formData.address.zip :
                                                                                formData[t.name]
                                            }
                                        />
                                    </Grid>
                                ))
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
                                    value={formData.description} />
                            </Grid>
                            <Grid key="serviceArea" item xs={12} sm={12}>
                                <ServiceAreaSelect

                                    onChange={(event) => handleInput(event, { name: 'serviceArea', value: event.target.value })}
                                    error={Boolean(errors['serviceArea'])}
                                    value={formData.serviceArea}
                                />
                            </Grid>

                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={isFormValid}
                        >
                            שמירת פרטים
                        </Button>
                    </Box>
                </Box>
            </Container>

            <Footer />
        </ThemeProvider>
    );
}