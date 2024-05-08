import { Avatar, Box, Card, CardActionArea, CardActions, CardContent, CardHeader, Container, CssBaseline, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GeneralContext } from "../App";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { RoleTypes, checkPermissions } from '../components/Navbar';
import { Search } from '../components/Search';
import Rating from '@mui/material/Rating';
import Footer from "../components/Footer";
import { keyframes } from '@emotion/react';
import Fab from '@mui/material/Fab';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ScrollTop from "../components/ScrollTop";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export default function Plumbers() {
    const { setLoader, setOpen, setSnackbarMsg, userRoleType, mode } = useContext(GeneralContext);
    const [plumbers, setPlumbers] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [filterByServiceArea, setFilterByServiceArea] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

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

    const handleSortChange = (ev) => {
        setSortBy(ev.target.value);
    }

    const handleFilterChange = (ev) => {
        setFilterByServiceArea(ev.target.value);

    }

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const filteredPlumbers = plumbers.filter(p =>
        p.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.last.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bizName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const crud = [
        {

            ariaLabel: 'delete',
            onClick: (id) => removePlumber(id),
            icon: <DeleteIcon />,
            permissions: [RoleTypes.admin, RoleTypes.master],
        },
        {
            ariaLabel: 'edit',
            onClick: (id) => editCard(id),
            icon: < ModeEditIcon />,
            permissions: [RoleTypes.master, RoleTypes.admin],
        },
    ];

    useEffect(() => {
        setLoader(true);
        let apiUrl = `http://localhost:1907/plumbers?sortBy=${sortBy}`;

        if (filterByServiceArea) {
            apiUrl += `&serviceArea=${filterByServiceArea}`;
        }

        fetch(apiUrl, {
            headers: { 'Authorization': localStorage.token },
        })
            .then(res => res.json())
            .then(data => setPlumbers(data))
            .catch(err => console.error(err))
            .finally(setLoader(false));
    }, [sortBy, filterByServiceArea]);

    const removePlumber = (item) => {
        if (!window.confirm("האם אתה בטוח שברצונך למחוק בעל מקצוע זה?")) {
            return;
        }

        fetch(`http://localhost:1907/plumbers/${item._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': localStorage.token },
        })
            .then(() => {
                const newData = plumbers.filter(x => x._id !== item._id);
                setPlumbers(newData);
                setOpen(true);
                setSnackbarMsg("בעל מקצוע נמחק בהצלחה");

            })

    }
    const editCard = (item) => {
        navigate(`/plumber/${item._id}`);
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Toolbar id="back-to-top-anchor" />
            <Container sx={{ py: 8, animation: `${fadeIn} 0.5s ease-in-out` }} maxWidth="lg">
                <Typography color={'primary'} fontWeight='medium' sx={{ py: 8, px: 8 }} component="h1" variant="h3">רשימת בעלי מקצוע</Typography>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">סינון לפי אזור</InputLabel>
                            <Select labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                value={filterByServiceArea}
                                onChange={handleFilterChange}
                                label="סינון לפי אזור">
                                <MenuItem value="">הכל</MenuItem>
                                <MenuItem value="מרכז">מרכז</MenuItem>
                                <MenuItem value="שרון">שרון</MenuItem>
                                <MenuItem value="שפלה">שפלה</MenuItem>
                                <MenuItem value="צפון">צפון</MenuItem>
                                <MenuItem value="דרום">דרום</MenuItem>
                                <MenuItem value="ירושלים">ירושלים</MenuItem>
                                <MenuItem value="יהודה ושומרון">יהודה ושומרון</MenuItem>

                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-helper-label">מיון לפי דירוג או מספר חוות דעת</InputLabel>
                            <Select value={sortBy} onChange={handleSortChange} id="demo-simple-select-helper" label="מיון לפי דירוג או מספר חוות דעת">
                                <MenuItem value="averageRating">דירוג ממוצע</MenuItem>
                                <MenuItem value="opinionsLength">מספר חוות דעת</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12} md={6}>

                        <Search onSearch={handleSearch} />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    {filteredPlumbers.map(p => (
                        <Grid item key={p._id} xs={12} sm={12} md={12}>
                            <Card sx={{ bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.light', maxWidth: 1400, display: 'flex', boxShadow: '1px 1px 1px 1px #0277bd' }}>
                                <CardHeader sx={{ borderTopLeftRadius: '10px', flexDirection: 'column', bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main' }}
                                    avatar={
                                        <Avatar
                                            sx={{ width: 95, height: 95 }}
                                            src={p.image.url}
                                            alt={p.image.alt}
                                        />
                                    }
                                    title={`${p.name.first} ${p.name.last}`}
                                    subheader={p.profession}
                                />
                                <CardActionArea onClick={() => navigate(`/plumberSite/${p._id}`)}>
                                    <Typography paddingLeft='10px' variant='h4' color="text.secondary">{p.bizName}</Typography>
                                    <div style={{ display: 'flex', margin: 'auto', flexDirection: 'row-reverse', justifyContent: 'space-evenly' }}>
                                        <Typography

                                            textAlign={'center'} mb={1}>
                                            <Rating name="half-rating-read" value={p.averageRating} precision={0.5} size="large" readOnly />
                                        </Typography>
                                        <Typography textAlign={'center'} variant='h6' color="text.secondary">חוות דעת <br /> {p.opinions.length}</Typography>
                                        <Typography variant='h6' color="text.secondary">אזור <br />{p.serviceArea.join(', ')}</Typography>
                                    </div>
                                    <CardContent style={{ flex: 1 }}>
                                        <Typography variant="body2" color="text.secondary"
                                            my={2}
                                            maxWidth={500}>
                                            {p.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions disableSpacing>
                                    {crud.map((item) => (
                                        (!item.permissions || checkPermissions(item.permissions, userRoleType)) && (
                                            <IconButton
                                                key={item.ariaLabel}
                                                aria-label={item.ariaLabel}
                                                onClick={() => item.onClick(p)}
                                                sx={{ width: 70, height: 70 }}
                                            >
                                                {item.icon}
                                            </IconButton>
                                        )
                                    ))}
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container >
            <ScrollTop >
                <Fab size="medium" color='primary' aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
            <Footer />
        </ThemeProvider >
    );
}