import { useState, useEffect, useContext } from "react";
import { useParams } from 'react-router-dom';
import { Avatar, Card, CardContent, CardHeader, Container, Grid, Typography, createTheme, CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from "@emotion/react";
import Rating from '@mui/material/Rating';
import moment from 'moment';
import 'moment/locale/he';
import { GeneralContext } from "../App";
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



export default function PlumberSite() {


    const { id } = useParams();
    const { setLoader, mode } = useContext(GeneralContext);
    const [plumber, setPlumber] = useState({
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

    const [opinions, setOpinions] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
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
        fetch(`http://localhost:1907/plumbers/${id}`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setPlumber(data))
            .catch(error => {
                console.error('Error fetching plumber details:', error);
            })

        fetch(`http://localhost:1907/plumbers/${id}/opinions`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                setOpinions(data);
                const ratingsSum = data.reduce((sum, opinion) => sum + opinion.rating, 0);
                const avgRating = data.length > 0 ? ratingsSum / data.length : 0;
                setAverageRating(avgRating);
            })
            .catch(error => {
                console.error('Error fetching opinions:', error);
            })
            .finally(() => {
                setLoader(false);
            });
    }, [id, setLoader]);

    return (
        <ThemeProvider theme={theme}>
            <Container sx={{
                py: 8, animation: `${fadeIn} 0.5s ease-in-out`
            }} maxWidth="lg">
                <CssBaseline />
                {
                    plumber &&
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card sx={{ maxWidth: "100%" }}>
                                <CardHeader sx={{ flexDirection: 'column' }}
                                    avatar={
                                        <Avatar
                                            sx={{ width: 95, height: 95 }}
                                            src={plumber.image.url}
                                            alt={plumber.image.alt}
                                        />
                                    }
                                    title={`${plumber.name.first} ${plumber.name.last}`}
                                    subheader={plumber.profession}
                                />
                                <Typography variant='h3' mb={5} textAlign={'center'} color={'primary'} fontWeight={'bold'}>{plumber.bizName}</Typography>
                                <CardContent>
                                    <Typography variant='h4' color="text.primary" mb={3}>איזורי שירות: {plumber.serviceArea.join(', ')}</Typography>
                                    <Typography variant='h4' mb={1}>אודות</Typography>
                                    <Typography variant="h4" color="text.secondary" mb={1}>{plumber.description}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <Card sx={{ maxWidth: "100%" }}>
                                <CardContent >
                                    <Typography variant='h3' mb={3} textAlign={'center'} color={'primary'}>ביקורת</Typography>
                                    <Typography variant='h4' mb={-1} textAlign={'center'} color="text.main" fontWeight={'bold'}>{averageRating.toFixed(1)}</Typography>
                                    <Typography
                                        textAlign={'center'} mb={1}>
                                        <Rating name="half-rating-read" value={averageRating} precision={0.5} readOnly />
                                    </Typography>
                                    <Typography variant='h4' mb={1} textAlign={'center'} fontWeight={'bold'}>{opinions.length}  חוות דעת </Typography>

                                    {opinions.map(opinion => (
                                        <Card key={opinion._id} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Typography variant="h5" gutterBottom>
                                                    {opinion.customerName} <br />
                                                    <Box component="span" sx={{ fontSize: '0.8rem', marginLeft: '5px', color: 'text.secondary' }}>
                                                        {moment(opinion.createdAt).format('LL')}
                                                    </Box>
                                                </Typography>

                                                <Rating name="half-rating-read" value={opinion.rating} readOnly />

                                                <Typography variant="body1">{opinion.comment}</Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                }
            </Container>
            <Footer />
        </ThemeProvider >
    );
}
