import Footer from "../components/Footer";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useContext } from "react";
import { GeneralContext } from "../App";
import { Button, Container, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;


export default function Home() {
    const { mode } = useContext(GeneralContext);
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

    return (
        <ThemeProvider theme={theme}>
            <Container
                component="main"
                maxWidth="md"
                sx={{
                    mt: '30px',
                    animation: `${fadeIn} 0.5s ease-in-out`,
                }}
            >
                <CssBaseline />
                <Typography variant="h3" fontWeight='700' color='primary.main' gutterBottom>
                    לינק שרברבים
                </Typography>
                <Typography variant="body1" paragraph>
                    ברוכים הבאים למערכת דירוג בעלי מקצוע.
                </Typography>
                <Typography variant="body1" paragraph>
                    כאן תוכלו למצוא ולדרג את בעלי המקצוע בתחום האינסטלציה.
                </Typography>
                <Button component={Link} to="/plumbers" variant="contained" color="primary">
                    לרשימת הבעלי מקצוע
                </Button>
            </Container>
            <Footer />
        </ThemeProvider>
    )
}