import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from "@mui/material/Stack";
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import firebase from 'firebase/compat/app';
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import './App.css';
import EntryTable from './components/EntryTable';
import EntryModal from './components/EntryModal';
import { Snackbar, Alert } from '@mui/material';
import { mainListItems } from './components/listItems';
import { db, SignInScreen } from './utils/firebase';
import { emptyEntry, tableHeaderIDs } from './utils/mutations';
import { categories } from './utils/categories';

// MUI styling constants

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

// App.js is the homepage and handles top-level functions like user auth.

export default function App() {

  // User authentication functionality. Would not recommend changing.

  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [currentUser, setcurrentUser] = useState(null); // Local user info

  // Table management functionality

  const [sortOption, setSortOption] = useState(tableHeaderIDs.NO_ORDER); // Sort table info
  const [filterOption, setFilterOption] = useState(-1); // Filter table info

  const compareStrings = (a, b, k) => (a[k] < b[k]) ? -1 : (a[k] > b[k]) ? 1 : 0;

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      setIsSignedIn(!!user);
      if (!!user) {
        setcurrentUser(user);
      }
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  // Navbar drawer functionality

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Data fetching from DB. Would not recommend changing.
  // Reference video for snapshot functionality https://www.youtube.com/watch?v=ig91zc-ERSE

  const [entries, setEntries] = useState([]);

  useEffect(() => {

    // ! Database query filters entries for current user. DO NOT CHANGE, editing this query may cause it to fail.
    const q = currentUser?.uid ? query(collection(db, "entries"), where("userid", "==", currentUser.uid)) : collection(db, "entries");

    /* NOTE: onSnapshot allows the page to update automatically whenever there is 
    an update to the database. This means you do not have to manually update
    the page client-side after making an add/update/delete. The page will automatically
    sync with the database! */
    onSnapshot(q, (snapshot) => {
      // Set Entries state variable to the current snapshot
      // For each entry, appends the document ID as an object property along with the existing document data
      // Sort if necessary (according to user choice of sortOption)
      setEntries(snapshot.docs
                  .map(doc => ({ ...doc.data(), id: doc.id }))
                  .sort((e1, e2) =>
                    sortOption === tableHeaderIDs.NAME ? compareStrings(e1, e2, "name")
                    : sortOption === tableHeaderIDs.LINK ? compareStrings(e1, e2, "link")
                    : sortOption === tableHeaderIDs.CATEGORY ? compareStrings(e1, e2, "category")
                    : 0))
    })
  }, [currentUser, sortOption]);

  // Sorts table according to user-selected key
  const handleSortOptionToggled = (event) => {
    const sort_op = event.target.value || tableHeaderIDs.NO_ORDER;
    setEntries(entries.sort((e1, e2) =>
                sort_op === tableHeaderIDs.NAME ? compareStrings(e1, e2, "name")
                : sort_op === tableHeaderIDs.LINK ? compareStrings(e1, e2, "link")
                : sort_op === tableHeaderIDs.CATEGORY ? compareStrings(e1, e2, "category")
                : 0));
    setSortOption(sort_op);
  }

  // Snackbar for delivering statuses on add/update/delete
  const [snackbar, toggleSnackbar] = useState({isOpen: false, message: "No message.", severity: "info"});
  const closeSnackbar = () => toggleSnackbar({isOpen: false, message: snackbar.message, severity: snackbar.severity});
  const snackbarCallback = (message, severity) => toggleSnackbar({isOpen: true, message: message, severity: severity});

  // Main content of homescreen. This is displayed conditionally from user auth status

  function mainContent() {
    if (isSignedIn) {
      return (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack direction="row" spacing={3}>
              <EntryModal entry={emptyEntry} type="add" user={currentUser} snackbarCallback={snackbarCallback} />
              {/* Sort table dropdown */}
              <FormControl sx={{m: 1, minWidth: 120}} size="small">
                <InputLabel id="sort_table_select_label">Sort</InputLabel>
                <Select
                  labelId="sort_table_select_label"
                  id="sort_table_select"
                  label="Sort"
                  value={sortOption}
                  onChange={handleSortOptionToggled}
                >
                  <MenuItem value={tableHeaderIDs.NO_ORDER}>No order</MenuItem>
                  <MenuItem value={tableHeaderIDs.NAME}>Name</MenuItem>
                  <MenuItem value={tableHeaderIDs.LINK}>Link</MenuItem>
                  <MenuItem value={tableHeaderIDs.CATEGORY}>Category</MenuItem>
                </Select>
              </FormControl>
              {/* Filter table dropdown */}
              <FormControl sx={{m: 1, minWidth: 120}} size="small">
                <InputLabel id="filter_table_select_label">Filter</InputLabel>
                <Select
                  labelId="filter_table_select_label"
                  id="filter_table_select"
                  label="Filter"
                  value={filterOption}
                  onChange={(event) => setFilterOption(event.target.value !== null ? event.target.value : -1)}
                >
                  {categories.map((category) => <MenuItem value={category.id}>{category.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            {/* Filter table according to user key */}
            <EntryTable snackbarCallback={snackbarCallback} entries={entries.filter((entry) => filterOption === -1 ? true : entry.category === filterOption)} />
          </Grid>
        </Grid>
      )
    } else return (
      <SignInScreen></SignInScreen>
    )
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Links for Climate Good
            </Typography>
            <Typography
              component="h1"
              variant="body1"
              color="inherit"
              noWrap
              sx={{
                marginRight: '20px',
                display: isSignedIn ? 'inline' : 'none'
              }}
            >
              Signed in as {firebase.auth().currentUser?.displayName}
            </Typography>
            <Button variant="contained" size="small"
              sx={{
                marginTop: '5px',
                marginBottom: '5px',
                display: isSignedIn ? 'inline' : 'none'
              }}
              onClick={() => firebase.auth().signOut()}
            >
              Log out
            </Button>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            {mainListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {mainContent()}
          </Container>
        </Box>
      </Box>
      {/* Snackbar for displaying notifications about add/update/delete */}
      <Snackbar open={snackbar.isOpen} autoHideDuration={4000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity}>
            {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}