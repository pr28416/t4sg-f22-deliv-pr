import { addDoc, collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from './firebase';

// Functions for database mutations

export const emptyEntry = {
   name: "",
   link: "",
   description: "",
   user: "",
   category: 0,
   rating: 0,
}

export const tableHeaderIDs = {
   NO_ORDER: 0,
   NAME: 1,
   LINK: 2,
   CATEGORY: 3,
   RATING: 4,
}

// Add an entry to Firebase database
export async function addEntry(entry) {
   await addDoc(collection(db, "entries"), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      rating: entry.rating,
      userid: entry.userid,
   });
}

// Update an existing entry to Firebase database
export async function updateEntry(entry) {
   await updateDoc(doc(db, "entries", entry.id), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      rating: entry.rating,
      userid: entry.userid,
   });
}

// Delete an entry from Firebase database
export async function deleteEntry(entry) {
   await deleteDoc(doc(db, "entries", entry.id));
}