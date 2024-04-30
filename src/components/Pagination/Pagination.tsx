import { Button, HStack } from "@chakra-ui/react";
import { getTodoPaginationStates } from "../../context/TodoPaginationContextApi";
import { TodoPaginationContextType } from "../../vite-env";

interface PaginationProps {
  selectedPage: number;
}

const PageBox = ({
  page,
  handler,
  isSelected,
}: {
  isSelected: boolean;
  page: number;
  handler: () => void;
}) => {
  return (
    <Button
      variant={"ghost"}
      bg={isSelected ? "#000722" : undefined}
      color={isSelected ? "white" : undefined}
      onClick={handler}
    >
      {page}
    </Button>
  );
};

const Pagination = ({ selectedPage }: PaginationProps) => {
  const { onNextPage, onPrevPage, totalPages, throttling } =
    getTodoPaginationStates() as TodoPaginationContextType;

  const pageBoxes = [];
  for (let i = 1; i <= totalPages; i++) {
    pageBoxes.push(
      <PageBox
        key={i}
        page={i}
        isSelected={i === selectedPage}
        handler={() => {}}
      />
    );
  }
  return (
    <HStack justifyContent={"center"}>
      <Button
        isDisabled={selectedPage === 1 || throttling}
        colorScheme="blue"
        variant={"ghost"}
        onClick={onPrevPage}
      >
        Prev
      </Button>
      {pageBoxes}
      <Button
        isDisabled={selectedPage === totalPages || throttling}
        colorScheme="blue"
        variant={"ghost"}
        onClick={onNextPage}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;
