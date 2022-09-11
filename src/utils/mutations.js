import { addDoc, collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from './firebase';

// Functions for database mutations

export const emptyEntry = {
   name: "",
   link: "",
   description: "",
   user: "",
   category: 0,
}

export const tableHeaderIDs = {
   NO_ORDER: 0,
   NAME: 1,
   LINK: 2,
   CATEGORY: 3
}

export async function addEntry(entry) {
   await addDoc(collection(db, "entries"), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      userid: entry.userid,
   });
}

export async function updateEntry(entry) {
   await updateDoc(doc(db, "entries", entry.id), {
      name: entry.name,
      link: entry.link,
      description: entry.description,
      user: entry.user,
      category: entry.category,
      userid: entry.userid,
   });
   // throw Error("Debug error for updateEntry");
}

export async function deleteEntry(entry) {
   await deleteDoc(doc(db, "entries", entry.id));
}