import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import AuthContextApi from "./context/AuthContextApi.tsx";
import { BrowserRouter } from "react-router-dom";
import TodoPaginationContextApi from "./context/TodoPaginationContextApi.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ChakraProvider>
    <BrowserRouter>
      <AuthContextApi>
        <TodoPaginationContextApi>
          <App />
        </TodoPaginationContextApi>
      </AuthContextApi>
    </BrowserRouter>
  </ChakraProvider>
);
