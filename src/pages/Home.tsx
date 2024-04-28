import { ChangeEvent, useEffect, useState } from "react";
import { Button, Container, Input, VStack } from "@chakra-ui/react";
import Todo from "../components/Todo/Todo";
import { todoServiceProvider } from "../firebase/appServices";

const Home = () => {
  const [textTitle, setTextTitle] = useState<TodoType["title"]>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        createdAt: new Date().toLocaleString(),
      };
      await todoServiceProvider.addTodo(newTodo);
      getTodosHandler();
      setTextTitle("");
    } catch (error) {
      console.error(error);
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
    } finally {
      setIsLoading(false);
    }
  };

  const getTodosHandler = async () => {
    setIsLoading(true);
    try {
      const allDocs = await todoServiceProvider.getTodos();
      setTodos(allDocs.docs.map((doc) => doc.data()) as typeof todos);
    } catch (error) {
      console.error(error);
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
                isLoading = {isLoading}
              />
            );
          })}
      </VStack>
    </Container>
  );
};

export default Home;
