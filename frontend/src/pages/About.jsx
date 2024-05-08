import Footer from "../components/Footer";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useContext } from "react";
import { GeneralContext } from "../App";
import { Container, Typography } from "@mui/material";
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;


export default function About() {
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
            <CssBaseline />
            <Container component="main" maxWidth="md" sx={{ mt: '30px', animation: `${fadeIn} 0.5s ease-in-out`, }} >

                <Typography variant="h3" color='primary.main' gutterBottom>
                    אודות הפרויקט
                </Typography>
                <Typography variant="body1" paragraph>
                    הפרויקט שלי הוא מערכת לדירוג וניהול בעלי מקצוע בתחום האינסטלציה שעובדים עם חברת הסדר ו/או חברת ביטוח מסוימת. <br />
                    המטרה היא שליחת לינק עם מדרג השרברבים ללקוח לצורך בחירת בעל מקצוע שיגיע לדירתו ושיקוף המידע ללקוחות בטרם הזמנת בעל מקצוע לדירתם.
                </Typography>
                <Typography variant="h5" color='primary.main' gutterBottom>
                    דרכים לפעול במערכת:
                </Typography>

                <Typography variant="h6" color='primary.dark'>דף בעלי המקצוע -</Typography>
                <Typography variant="body1" paragraph>
                    בעמוד זה תוכלו לצפות ברשימה של כל הבעלי המקצוע הרשומים במערכת, לסנן אותם על פי אזור, למיין לפי דירוג ועוד.
                </Typography>
                <Typography variant="h6" color='primary.dark'>ניהול משתמשים -</Typography>
                <Typography variant="body1" paragraph>
                    משתמשי האדמין יכולים להוסיף, לערוך ולמחוק בעלי מקצוע מהמערכת לפי הצורך, לצורך כך ישנה אופציה להתחברות למנהלים הרשומים במערכת.
                </Typography>
                <Typography variant="h6" color='primary.dark'> דף השרברב -</Typography>
                <Typography variant="body1" paragraph>
                    כל משתמש יכול לצפות בדף האישי של בעל המקצוע, לראות את הדירוג שלו ואת החוות דעת שנכתבו עליו על ידי משתמשים אחרים.
                </Typography>
                <Typography variant="h6" color='primary.dark'> הוספת חוות דעת -</Typography>
                <Typography variant="body1" paragraph>
                    כל משתמש יכול להוסיף חוות דעת חדשה על בעל מקצוע מסוים, בתאוריה ובתכנון האמיתי הכוונה היא לחבר אותו לממשק שברגע שמסתיים ביקור בדירת לקוח ישלח אליו הלינק של טופס הוספת חוות דעת מובנה כבר לבעל המקצוע שביקר בדירתו, ברגע שהסקר ימולא חוות הדעת תתווסף לעמוד השרברב.
                </Typography>


            </Container>

            <Footer />
        </ThemeProvider>
    )
}