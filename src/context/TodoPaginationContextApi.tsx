import { createContext, useContext, useState } from "react";
import {
  Doc,
  TodoPaginationContextApiProps,
  TodoPaginationContextType,
  TodoType,
} from "../vite-env";
import { todoServiceProvider } from "../firebase/appServices";
import { getUser } from "./AuthContextApi";

const TodoPaginationContext = createContext<
  TodoPaginationContextType | undefined
>(undefined);

const TodoPaginationContextApi = ({
  children,
}: TodoPaginationContextApiProps) => {
  const email = getUser()?.email;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [throttling, setThrottling] = useState<boolean>(false);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [lastDoc, setLastDoc] = useState<Doc>({} as Doc);
  const [firstDoc, setFirstDoc] = useState<Doc>({} as Doc);

  const onNextPage = async () => {
    setThrottling(true);
    try {
      if (currentPage + 1 === totalPages)
        todoServiceProvider.setLimit(currentPage);
      const snapshot = await todoServiceProvider.getNextTodos(
        email as string,
        lastDoc as Doc,
        currentPage === totalPages
      );
      const todosData = snapshot.docs.map((doc, i) => {
        if (i === 0) setFirstDoc(doc);
        if (i === snapshot.docs.length - 1) setLastDoc(doc);
        return doc.data();
      });
      console.log({ todosData });
      setTodos(todosData as TodoType[]);
      setCurrentPage((prev) => {
        if (currentPage === totalPages) return prev;
        return prev + 1;
      });
      todoServiceProvider.limit = 3;
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setThrottling(false);
    }
  };

  const onPrevPage = async () => {
    setThrottling(true);

    try {
      const snapshot = await todoServiceProvider.getPrevTodos(
        email as string,
        firstDoc as Doc
      );

      const docs = snapshot.docs.slice(
        snapshot.docs.length - 3,
        snapshot.docs.length
      );

      const todosData = docs.map((doc, i) => {
        if (i === 0) setFirstDoc(doc);
        if (i === docs.length - 1) setLastDoc(doc);
        return doc.data();
      });

      setTodos(todosData as TodoType[]);
      console.log({ todosData });
      setCurrentPage((prev) => {
        if (currentPage === 1) return prev;
        return prev - 1;
      });
    } catch (error) {
    } finally {
      setThrottling(false);
    }
  };


  return (
    <TodoPaginationContext.Provider
      value={{
        todos,
        setTodos,
        currentPage,
        setCurrentPage,
        setFirstDoc,
        setLastDoc,
        lastDoc,
        firstDoc,
        onNextPage,
        onPrevPage,
        totalPages,
        setTotalPages,
        setThrottling,
        throttling,
      }}
    >
      {children}
    </TodoPaginationContext.Provider>
  );
};

export default TodoPaginationContextApi;
export const getTodoPaginationStates = () => useContext(TodoPaginationContext);
