import { HStack, IconButton, Image, Text, Tooltip } from "@chakra-ui/react";
import { auth } from "../../firebase/firebaseConfig";
import { getUser } from "../../context/AuthContextApi";
import { MdLogout } from "react-icons/md";

const Navbar = () => {
  const user = getUser();
  return (
    <HStack
      alignItems={"center"}
      height={"70px"}
      px={5}
      bg={"#000722"}
      position={"sticky"}
      top={0}
      zIndex={100}
    >
      {user?.email ? (
        <HStack spacing={5} justifyContent={"flex-start"} color={"white"}>
          <Image
            color={"white"}
            src={user?.photo}
            alt="Photo"
            boxSize={10}
            borderRadius={"full"}
          />
          <Text>{user?.email}</Text>
          <Tooltip hasArrow label="Logout">
            <IconButton
              variant={"ghost"}
              color={"white"}
              fontSize={25}
              _hover={{ bg: "gray" }}
              aria-label="logout-button"
              icon={<MdLogout />}
              onClick={() => auth.signOut()}
            />
          </Tooltip>
        </HStack>
      ) : (
        <Text color="white">Loading...</Text>
      )}
    </HStack>
  );
};

export default Navbar;
