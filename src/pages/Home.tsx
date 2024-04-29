import { ChangeEvent, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import Todo from "../components/Todo/Todo";
import { todoServiceProvider } from "../firebase/appServices";
import { getUser } from "../context/AuthContextApi";
import { DocumentData } from "firebase/firestore";

const Home = () => {
  if (!getUser()) return;
  const user = getUser();
  const [textTitle, setTextTitle] = useState<TodoType["title"]>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSortedInDesc, setIsSortedInDesc] = useState<boolean>(false);

  const textChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTextTitle(e.target.value);
  };

  const [todos, setTodos] = useState<TodoType[]>([]);

  const deleteTodo = async (id: TodoType["id"]) => {
    setIsLoading(true);
    try {
      console.log({ id });
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
      const allDocs = await todoServiceProvider.getTodos(user?.email as string);
      console.log({ allDocs });
      let allTodos = allDocs.docs.map((doc) => doc.data());
      setTodos(allTodos as typeof todos);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTodosHandler();
  }, []);

  return (
    <Container padding={"20px"}>
      <Input
        type="text"
        placeholder="Enter your todo here..."
        value={textTitle}
        onChange={textChangeHandler}
        marginY={3}
      />
      <HStack justifyContent={"space-between"} alignItems={"center"}>
        <Button
          marginY={3}
          _hover={{ bg: "" }}
          color={"white"}
          bg={"#000722"}
          onClick={createTodoHandler}
          isLoading={isLoading}
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
    </Container>
  );
};

export default Home;
