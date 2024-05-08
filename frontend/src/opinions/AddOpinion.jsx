import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../App';
import Joi from 'joi';
import { useState, useContext, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Rating from '@mui/material/Rating';
import RateReviewIcon from '@mui/icons-material/RateReview';
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


export default function AddOpinion() {
    const [formData, setFormData] = useState({
        plumberId: '',
        customerName: '',
        rating: '',
        comment: '',
    })
    const [errors, setErrors] = useState({});
    const [plumber, setPlumber] = useState([]);
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const { setLoader, mode, setOpen, setSnackbarMsg } = useContext(GeneralContext);
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
        setLoader(true);

        fetch(`http://localhost:1907/plumbers`)
            .then(res => res.json())
            .then(data => {
                setPlumber(data);
                setLoader(false);
            })
            .catch(err => {
                console.error(err);
                setLoader(false);
            });
    }, []);
    const schema = Joi.object({
        plumberId: Joi.required().messages(hebrewMessages),
        customerName: Joi.string().min(2).max(15).required().messages(hebrewMessages),
        rating: Joi.number().required(),
        comment: Joi.allow()
    })

    const handleInput = (name, value) => {
        const obj = {
            ...formData,
            [name]: value,
        };


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

    const save = ev => {
        ev.preventDefault();

        setLoader(true);
        fetch(`http://localhost:1907/plumbers/${formData.plumberId}/opinions`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
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
                setLoader(false);
                navigate('/plumbers');
                setOpen(true);
                setSnackbarMsg("חוות הדעת פורסמה בהצלחה");
            })
            .catch(err => {
                setLoader(false);
                alert(err.message);
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
                        <RateReviewIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" fontWeight='medium' >הוספת חוות דעת</Typography>
                    <Box component="form" onSubmit={save} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <Autocomplete
                                    value={plumber.find(p => p._id === formData.plumberId) || null}
                                    onChange={(event, newValue) => {
                                        handleInput('plumberId', newValue ? newValue._id : '');
                                    }}
                                    options={plumber}
                                    getOptionLabel={(option) => option.bizName}
                                    renderInput={(params) => <TextField {...params} label="בעל מקצוע" required />
                                    }
                                />

                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography component="legend">דירוג</Typography>
                                <Rating
                                    dir='ltr'
                                    name="rating"
                                    value={parseInt(formData.rating)}
                                    size='large'
                                    onChange={(event, newValue) => {
                                        handleInput('rating', newValue);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    error={Boolean(errors.customerName)}
                                    helperText={errors.customerName}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="customerName"
                                    label="שם המבוטח"
                                    name="customerName"
                                    type="text"
                                    autoComplete="customerName"
                                    onChange={(event) => handleInput('customerName', event.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>

                                <TextField
                                    error={Boolean(errors.comment)}
                                    helperText={errors.comment}
                                    margin="normal"
                                    fullWidth
                                    rows={4}
                                    id="outlined-multiline-static"
                                    multiline
                                    label="חוות דעת"
                                    name="comment"
                                    type="text"
                                    autoComplete="comment"
                                    onChange={(event) => handleInput('comment', event.target.value)}
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
                            פרסם חוות דעת
                        </Button>
                    </Box>
                </Box>
            </Container>

            <Footer />
        </ThemeProvider>
    );

}
