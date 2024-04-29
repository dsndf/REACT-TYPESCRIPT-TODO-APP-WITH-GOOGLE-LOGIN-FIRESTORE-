import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  IconButton,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import React, { ChangeEvent, useState } from "react";
import { GrEdit } from "react-icons/gr";

interface TodoPropsType extends TodoType {
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newTitle: string) => void;
  isLoading: boolean;
}

const Todo = ({
  title,
  id,
  createdAt,
  deleteTodo,
  editTodo,
  isLoading,
}: TodoPropsType) => {
  const [editActive, setEditActive] = useState<boolean>(false);
  const [editTask, setEditTask] = useState<TodoType["title"]>(title);
  const editChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEditTask(e.target.value);
  };
  return (
    <Box
      boxShadow={"0 0 5px #a8c2cc66"}
      border={"1px solid smoke"}
      padding={4}
      borderRadius={4}
      margin={2}
      width={"full"}
      shadow={"0 0 8px gray"}
    >
      <HStack justifyContent={"space-between"}>
        {editActive ? (
          <Input onChange={editChangeHandler} value={editTask} />
        ) : (
          <VStack alignItems={"flex-start"}>
            <Text fontWeight={500} fontSize={20}>
              {title || "Todo"}
            </Text>
            <Text color="gray" fontWeight={500} fontSize={15}>
              {moment(createdAt).format("YYYY/MM/D hh:mm")}
              <Text color="navy"> {moment(createdAt).fromNow()}</Text>
            </Text>
          </VStack>
        )}

        <ButtonGroup isDisabled={isLoading} size="sm" isAttached={false}>
          <Button
            variant={"solid"}
            colorScheme="red"
            onClick={() => {
              deleteTodo(id);
            }}
          >
            Delete
          </Button>
          <IconButton
            aria-label="Add to friends"
            icon={<GrEdit />}
            bg="#000722"
            color="white"
            style={{
              color: editActive ? "green" : "",
              backgroundColor: editActive ? "lightgreen" : "",
            }}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              if (editActive) {
                editTodo(id, editTask);
                setEditActive(false);
              } else setEditActive(true);
            }}
          />
        </ButtonGroup>
      </HStack>
    </Box>
  );
};

export default Todo;
