import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  getCountFromServer,
  endBefore,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { DocumentData } from "firebase/firestore/lite";
import { TodoType } from "../vite-env";

const todoCollection = collection(db, "Todo");

class TodoServices {
  constructor(public limit: number, private limitForLastPage: number = 0) {
    this.limit = limit;
  }
  pageCount(count: number): number {
    return Math.ceil(count / this.limit);
  }
  async setLimit(page: number) {
    const docsCount = (await getCountFromServer(todoCollection)).data().count;
    this.limitForLastPage = docsCount - this.limit * page;
  } 

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

  getPrevTodos(email: string, firstDoc: QueryDocumentSnapshot<DocumentData>) {
    const dataQuery = query(
      todoCollection,
      where("creatorEmail", "==", email),
      orderBy("createdAt", "desc"),
      endBefore(firstDoc)
    );

    return getDocs(dataQuery);
  }

  getNextTodos(
    email: string,
    lastDoc: QueryDocumentSnapshot<DocumentData>,
    isLastPage: boolean
  ) {
    console.log({ limit: this.limit });
    const dataQuery = query(
      todoCollection,
      where("creatorEmail", "==", email),
      orderBy("createdAt", "desc"),
      startAfter(lastDoc),
      limit(isLastPage ? this.limitForLastPage : this.limit)
    );
    return getDocs(dataQuery);
  }

  async getTodos(email: string) {
    const docsCount = (await getCountFromServer(todoCollection)).data().count;
    const dataQuery = query(
      todoCollection,
      where("creatorEmail", "==", email),
      orderBy("createdAt", "desc"),
      limit(this.limit)
    );
    console.log({ docsCount });

    return { resultDocsPerPage: await getDocs(dataQuery), docsCount };
  }
}
export const todoServiceProvider = new TodoServices(4);
