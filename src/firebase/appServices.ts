import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { orderBy } from "firebase/firestore/lite";

const todoCollection = collection(db, "Todo");

class TodoServices {
  async addTodo(todo: TodoType) {
    const newdoc = await addDoc(todoCollection, {
      ...todo,
      createdAt: String(todo.createdAt),
    });
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
  getTodos(email: string) {
    return getDocs(query(todoCollection, where("creatorEmail", "==", email)));
  }
}
export const todoServiceProvider = new TodoServices();
