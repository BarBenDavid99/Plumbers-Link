import { useState } from "react";
import { Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';


export default function Footer() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    return (
        <>
            <footer dir="ltr" >
                <Box id="footer-links" paddingTop={5} >
                    <a href="mailto:barbendavid12@gmail.com" target="_blank" rel="noreferrer">
                        <EmailIcon fontSize="large" color="primary" />
                    </a>
                    <a href="https://www.linkedin.com/in/bar-ben-david-346a33260/" target="_blank" rel="noreferrer">
                        <LinkedInIcon fontSize="large" color="primary" />
                    </a>
                    <a href="https://github.com/BarBenDavid99" target="_blank" rel="noreferrer">
                        <GitHubIcon fontSize="large" color="primary" />
                    </a>
                </Box>
                <Box id="copyright">&#169;<span> {currentYear} </span> Bar Ben David. All
                    rights reserved.
                </Box>
            </footer >
        </>
    )
}
