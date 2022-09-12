import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import EntryModal from './EntryModal';
import { Chip } from '@mui/material';
import { getCategory } from '../utils/categories';
import RatingMeter from './RatingMeter';
import * as React from 'react';

// Table component that displays entries on home screen

export default function EntryTable({ entries, snackbarCallback }) {

   return (
      <TableContainer component={Paper}>
         <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
               <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Link</TableCell>
                  <TableCell align="right">User</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="center">Rating</TableCell>
                  <TableCell align="right">Open</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {entries.map((entry) => (
                  <TableRow
                     key={entry.id}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                     <TableCell component="th" scope="row">
                        {entry.name}
                     </TableCell>
                     <TableCell align="right"><Link href={entry.link}>{entry.link}</Link></TableCell>
                     <TableCell align="right">{entry.user}</TableCell>
                     <TableCell align="right">
                        <Chip label={getCategory(entry.category).name} variant="outlined" color={getCategory(entry.category).chipColorScheme} />
                     </TableCell>
                     <TableCell align="center">
                        <RatingMeter initRating={entry.rating} editable={false}></RatingMeter>
                     </TableCell>
                     <TableCell sx={{ "padding-top": 0, "padding-bottom": 0 }} align="right">
                        <EntryModal entry={entry} type="edit" snackbarCallback={snackbarCallback} />
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
}
