/// <reference types="vite/client" />

import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { Dispatch, ReactNode, SetStateAction } from "react";

type Doc = QueryDocumentSnapshot<DocumentData>;
type Docs = QuerySnapshot<DocumentData, DocumentData>;
type State<T> = Dispatch<SetStateAction<T>>;

type TodoType = {
  title: string;
  id: string;
  createdAt: Date;
  creatorEmail: string;
};

interface TodoPaginationContextType {
  currentPage: number;
  setCurrentPage: State<number>;
  totalPages: number;
  setTotalPages: State<number>;
  lastDoc: Doc;
  firstDoc: Doc;
  setLastDoc: State<Doc>;
  setFirstDoc: State<Doc>;
  onNextPage: () => void;
  onPrevPage: () => void;
  todos: TodoType[];
  setTodos: State<TodoType[]>;
  throttling: boolean;
  setThrottling: State<boolean>;
}

interface TodoPaginationContextApiProps {
  children: ReactNode;
}

interface TodoPropsType extends TodoType {
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newTitle: string) => void;
  isLoading: boolean;
}
