import { useTheme } from '@emotion/react';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { StepIcon } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { Snackbar, Alert } from '@mui/material';
import * as React from 'react';
import { useState } from 'react';
import { categories } from '../utils/categories';
import { addEntry, deleteEntry, updateEntry } from '../utils/mutations';
import RatingMeter from './RatingMeter';

// Modal component for individual entries.

/* EntryModal parameters:
entry: Data about the entry in question
type: Type of entry modal being opened. 
   This can be "add" (for adding a new entry) or 
   "edit" (for opening or editing an existing entry from table).
user: User making query (The current logged in user).
snackbarCallback: A callback reference to a similar function in App.js to display notifications.*/

export default function EntryModal({ entry, type, user, snackbarCallback }) {

   // State variables for modal status

   const [open, setOpen] = useState(false);
   const [name, setName] = useState(entry.name);
   const [link, setLink] = useState(entry.link);
   const [description, setDescription] = useState(entry.description);
   const [category, setCategory] = useState(entry.category);
   const [rating, setRating] = useState(entry.rating);

   // Modal visibility handlers

   const handleClickOpen = () => {
      setOpen(true);
      setName(entry.name);
      setLink(entry.link);
      setDescription(entry.description);
      setCategory(entry.category);
      setRating(entry.rating);
   };

   const handleClose = () => {
      setOpen(false);
   };

   // Mutation handlers

   // Handles add mutation along with appropriate snackbar notification
   const handleAdd = () => {
      const newEntry = {
         name: name,
         link: link,
         description: description,
         user: user?.displayName,
         category: category,
         rating: rating,
         userid: user?.uid,
      };

      addEntry(newEntry)
         .then(
            () => snackbarCallback(`Successfully added ${name}.`, "info"),
            (err) => snackbarCallback(`Could not add ${name}: ${err.message}.`, "error")
         );
      handleClose();
   };

   // Handles edit mutation along with appropriate snackbar notification
   const handleEdit = () => {
      const updatedEntry = {
         name: name || entry.name,
         link: link || entry.link,
         description: description || entry.description,
         user: user?.displayName || entry.user,
         category: category,
         rating: rating || entry.rating,
         userid: user?.uid || entry.userid,
         id: entry.id
      }
      updateEntry(updatedEntry)
         .then(
            () => snackbarCallback(`Successfully updated ${updatedEntry.name}.`, "success"),
            err => snackbarCallback(`Could not update ${updatedEntry.name}: ${err.message}.`, "error")
         );
      handleClose();
   }

   // Handles delete mutation along with appropriate snackbar notification
   const handleDelete = () => {
      const name = entry.name;
      deleteEntry(entry)
         .then(
            () => snackbarCallback(`Successfully deleted ${name}.`, "secondary"),
            err => snackbarCallback(`Could not delete ${name}: ${err.message}.`, "error")
         );
      handleClose();
   }

   // Button handlers for modal opening and inside-modal actions.
   // These buttons are displayed conditionally based on if adding or editing/opening.

   const openButton =
      type === "edit" ? <IconButton onClick={handleClickOpen}>
         <OpenInNewIcon />
      </IconButton>
         : type === "add" ? <Button variant="contained" onClick={handleClickOpen}>
            Add entry
         </Button>
            : null;

   const actionButtons =
      type === "edit" ?
         <DialogActions>
            <Button color="error" onClick={handleDelete}>Delete</Button>
            <div style={{flex: '1 0 0'}} />
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleEdit}>Edit</Button>
         </DialogActions>
         : type === "add" ?
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button variant="contained" onClick={handleAdd}>Add Entry</Button>
            </DialogActions>
            : null;

   return (
      <div>
         {openButton}
         <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{type === "edit" ? name : "Add Entry"}</DialogTitle>
            <DialogContent>
               <TextField
                  margin="normal"
                  id="name"
                  label="Name"
                  fullWidth
                  variant="standard"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="link"
                  label="Link"
                  placeholder="e.g. https://google.com"
                  fullWidth
                  variant="standard"
                  value={link}
                  onChange={(event) => setLink(event.target.value)}
               />
               <TextField
                  margin="normal"
                  id="description"
                  label="Description"
                  fullWidth
                  variant="standard"
                  multiline
                  maxRows={8}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
               />
               <FormControl fullWidth sx={{ "margin-top": 20 }}>
                  <InputLabel id="demo-simple-select-label">Category</InputLabel>
                  <Select
                     labelId="demo-simple-select-label"
                     id="demo-simple-select"
                     value={category}
                     label="Category"
                     onChange={(event) => setCategory(event.target.value)}
                  >
                     {categories.map((category) => (<MenuItem value={category.id}>{category.name}</MenuItem>))}
                  </Select>
               </FormControl>
               <div style={{"display": "flex", "marginTop": 16, "alignItems": "center"}}>
                  <div><InputLabel>Rating</InputLabel></div>
                  <RatingMeter initRating={rating} editable={true} parentCallback={(rating) => setRating(rating)} />
               </div>
            </DialogContent>
            {actionButtons}
         </Dialog>
      </div>
   );
}