import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { orderBy } from "firebase/firestore/lite";
// const userCollection = collection(db, "User");

const todoCollection = collection(db, "Todo");

class TodoServices {
  async addTodo(todo: TodoType) {
    const newdoc = await addDoc(todoCollection, todo);
    return updateDoc(newdoc, { id: newdoc.id });
  }
  updateTodo(id: string, textTitle: string) {
    const docRef = doc(db, "Todo", id);
    return updateDoc(docRef, { title: textTitle });
  }
  deleteTodo(id: string) {
    const docRef = doc(db, "Todo", id);
    return deleteDoc(docRef);
  }
  getTodos() {
    return getDocs(query(todoCollection, orderBy("createdAt", "asc")));
  }
}
export const todoServiceProvider = new TodoServices();
