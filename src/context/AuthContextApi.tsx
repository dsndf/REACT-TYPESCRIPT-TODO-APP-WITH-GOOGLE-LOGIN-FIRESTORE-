import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth, signInWithGooglePopup } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  user?: {
    name: string;
    photo: string;
    email: string;
  };
  setUser?: Dispatch<SetStateAction<AuthContextType["user"]>>;
}

export const AuthContext = createContext<AuthContextType>({});

const AuthContextApi = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"]>({
    name: "",
    photo: "",
    email: "",
  });

  const navigate = useNavigate();

  useEffect(() => {

    auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/google/login");
      } else {
        console.log(user)
        setUser({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        } as AuthContextType["user"]);
        navigate("/");
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextApi;
export const getUser = ()=>useContext(AuthContext).user;
