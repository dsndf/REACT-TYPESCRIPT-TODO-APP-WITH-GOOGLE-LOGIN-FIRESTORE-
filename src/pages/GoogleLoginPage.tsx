import { Box, Button, Heading, Stack, Tooltip } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithGooglePopup } from "../firebase/firebaseConfig";
import { useContext, useState } from "react";
import { AuthContext, AuthContextType } from "../context/AuthContextApi";
const GoogleLoginPage = () => {
  const authState = useContext(AuthContext) as AuthContextType;
  const [throttling, setThrottling] = useState<boolean>(false);
  const googleLoginHanlder = async () => {
    setThrottling(true);
    try {
      const result = await signInWithGooglePopup();
      const { user } = result;

      if (authState.setUser) {
        authState.setUser({
          name: user.displayName,
          photo: user.photoURL,
          email: user.email,
        } as AuthContextType["user"]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setThrottling(false);
    }
  };

  return (
    <Box height={"100vh"} p={10}>
      <Stack height={"100%"} justifyContent={"center"} alignItems={"center"}>
        <Heading fontSize={["larger", "x-large", "xx-large"]} my={5}>
          Login to create your todos
        </Heading>
        <Tooltip hasArrow label="Login">
          <Button
            onClick={googleLoginHanlder}
            leftIcon={<FcGoogle />}
            variant={"solid"}
            size={"lg"}
            bg={"#000722"}
            color={"white"}
            _hover={{ bg: "" }}
            isLoading={throttling}
          >
            Google Login
          </Button>
        </Tooltip>
      </Stack>
    </Box>
  );
};

export default GoogleLoginPage;
