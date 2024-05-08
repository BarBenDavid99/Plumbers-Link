import { useState, createContext, useEffect } from 'react';
import './App.css';
import { Router } from './Router';
import Navbar, { RoleTypes } from './components/Navbar';
import Loader from './components/Loader';
import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import CustomizedSnackbars from './components/Snackbar';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });

export const GeneralContext = createContext();

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

function App() {
  const [user, setUser] = useState()
  const [loader, setLoader] = useState(true);
  const [userRoleType, setUserRoleType] = useState(RoleTypes.none);
  const [mode, setMode] = useState('light');
  const [snackbarMsg, setSnackbarMsg] = useState("BEEP");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (localStorage.token) {
      fetch("http://localhost:1907/onlyAdmin/me", {
        credentials: 'include',
        headers: {
          'Authorization': localStorage.token,
        },
      })
        .then(res => {
          if (res.ok) {
            return res.json();
          }
          else {
            return res.json().then(x => {
              throw new Error(x.message);
            });
          }
        })
        .then(data => {
          setUser(data);

          if (data.isMaster === true) {
            setUserRoleType(RoleTypes.master);
          } else {
            setUserRoleType(RoleTypes.admin);
          }
        })
        .catch(err => {
          setUser(null);
          setUserRoleType(RoleTypes.customer);
        })
        .finally(() => setLoader(false));
    } else {

      setUser(null);
      setUserRoleType(RoleTypes.customer);
      setLoader(false);
    }
  }, []);



  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        direction: 'rtl',
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
      }),
    [mode],
  );

  return (

    <CacheProvider value={cacheRtl}>
      <ColorModeContext.Provider value={colorMode}>
        <CssBaseline />
        <GeneralContext.Provider value={{ user, setUser, setLoader, userRoleType, setUserRoleType, mode, setMode, snackbarMsg, setSnackbarMsg, open, setOpen, }}>
          <ThemeProvider theme={theme}>
            <Navbar />
            <Router />
            {loader && <Loader />}
          </ThemeProvider>
          <CustomizedSnackbars />
        </GeneralContext.Provider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}

export default App;
