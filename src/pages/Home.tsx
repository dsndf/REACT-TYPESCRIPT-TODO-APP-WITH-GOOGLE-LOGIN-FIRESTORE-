import { ChangeEvent, useEffect, useState } from "react";
import {
  Button,
  Container,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import Todo from "../components/Todo/Todo";
import { todoServiceProvider } from "../firebase/appServices";
import { getUser } from "../context/AuthContextApi";
import { TodoPaginationContextType, TodoType } from "../vite-env";
import { getTodoPaginationStates } from "../context/TodoPaginationContextApi";
import Pagination from "../components/Pagination/Pagination";
const Home = () => {
  const user = getUser();
  const {
    todos,
    setTodos,
    setLastDoc,
    setTotalPages,
    currentPage,
    setCurrentPage,
  } = getTodoPaginationStates() as TodoPaginationContextType;
  const [textTitle, setTextTitle] = useState<TodoType["title"]>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSortedInDesc, setIsSortedInDesc] = useState<boolean>(true);

  const textChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTextTitle(e.target.value);
  };

  const deleteTodo = async (id: TodoType["id"]) => {
    setIsLoading(true);
    try {
      console.log({ id });
      setCurrentPage(1);
      await todoServiceProvider.deleteTodo(id);
      getTodosHandler();
    } catch (error) {
      console.error(error);
      if (error instanceof Error) alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  const createTodoHandler = async () => {
    if (!textTitle) return;
    setIsLoading(true);
    try {
      let randomId = String(Math.round(Math.random() * 1000));
      let newTodo: TodoType = {
        title: textTitle,
        id: randomId,
        createdAt: new Date(),
        creatorEmail: user?.email as string,
      };
      await todoServiceProvider.addTodo(newTodo);
      getTodosHandler();
      setTextTitle("");
    } catch (error) {
      console.error(error);
      if (error instanceof Error) alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  const editTodoHanlder = async (id: string, newTitle: string) => {
    setIsLoading(true);
    try {
      await todoServiceProvider.updateTodo(id, newTitle);
      getTodosHandler();
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSortedByDate = (arr: TodoType[]): void => {
    let sortedTodos = arr.sort((a, b) => {
      let d1 = new Date(a?.createdAt);
      let d2 = new Date(b?.createdAt);
      return !isSortedInDesc
        ? d2.getTime() - d1.getTime()
        : d1.getTime() - d2.getTime();
    });
    setIsSortedInDesc(!isSortedInDesc);
    return setTodos(sortedTodos);
  };

  const getTodosHandler = async () => {
    setIsLoading(true);
    try {
      const { resultDocsPerPage, docsCount } =
        await todoServiceProvider.getTodos(user?.email as string);
      setLastDoc(resultDocsPerPage.docs[resultDocsPerPage.docs.length - 1]);
      let allTodos = resultDocsPerPage.docs.map((doc) => doc.data());
      setTodos(allTodos as typeof todos);
      setTotalPages(todoServiceProvider.pageCount(docsCount));
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    getTodosHandler();
  }, [user]);

  return (
    <Container padding={"20px"}>
      <Input
        type="text"
        placeholder="Enter your todo here..."
        value={textTitle}
        onChange={textChangeHandler}
        marginY={3}
        maxLength={30}
      />
      <HStack justifyContent={"space-between"} alignItems={"center"}>
        <Button
          marginY={3}
          _hover={{ bg: "" }}
          color={"white"}
          bg={"#000722"}
          onClick={createTodoHandler}
          isDisabled={!textTitle}
          isLoading={isLoading}
          size={['sm']}
        >
          Create
        </Button>
        <Button
          size={"sm"}
          variant={"outline"}
          colorScheme="green"
          onClick={() => getSortedByDate([...todos])}
        >
          Sort by date {!isSortedInDesc ? "desc" : "asc"}
        </Button>
      </HStack>

      <VStack>
        {todos &&
          todos.map((v) => {
            return (
              <Todo
                key={v?.id}
                title={v?.title}
                id={v?.id}
                createdAt={v?.createdAt}
                deleteTodo={deleteTodo}
                editTodo={editTodoHanlder}
                isLoading={isLoading}
                creatorEmail={v?.creatorEmail}
              />
            );
          })}
      </VStack>
      {todos.length !== 0 && <Pagination selectedPage={currentPage} />}
      {todos.length === 0 && <Text textAlign={"center"}>No todos</Text>}
    </Container>
  );
};

export default Home;
