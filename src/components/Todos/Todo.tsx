import { VStack } from "@chakra-ui/react";
import { TodoPropsType, TodoType } from "../../vite-env";
import Todo from "../Todo/Todo";

const Todos = ({
  todos,
  editTodo,
  deleteTodo,
  isLoading,
}: {
  todos: TodoType[];
  deleteTodo: TodoPropsType["deleteTodo"];
  editTodo: TodoPropsType["editTodo"];
  isLoading: boolean;
}) => {
  return (
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
              editTodo={editTodo}
              isLoading={isLoading}
              creatorEmail={v?.creatorEmail}
            />
          );
        })}
    </VStack>
  );
};

export default Todos;
