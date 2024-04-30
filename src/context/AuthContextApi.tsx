import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  user?: {
    name: string;
    photo: string;
    email: string;
  } | null;
  setUser?: Dispatch<SetStateAction<AuthContextType["user"]>>;
}

export const AuthContext = createContext<AuthContextType>({});

const AuthContextApi = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (!user) {
        setUser(null);
        navigate("/");
      } else {
        console.log(user);
        setUser({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        } as AuthContextType["user"]);
        navigate("/user/dashboard");
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
export const getUser = () => useContext(AuthContext).user;
