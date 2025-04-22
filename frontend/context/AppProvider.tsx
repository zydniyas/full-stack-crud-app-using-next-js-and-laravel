"use client";

import Loader from "@/components/Loader";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { log } from "node:console";

interface AppProviderType {
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => Promise<void>;
  authToken: string | null;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  logout: () => void;

  getProducts: () => Promise<void>;
  products: productData[];
}

interface productData {
  id: number;
  title: string;
  discription: string;
  price: number;
  file: File | null;
  banner_image: string;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authToken, setAuthToken] = useState<string | null>(
    Cookies.get("authToken")
  );
  const [products, setProducts] = useState<productData[]>([]);

  const router = useRouter();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log(email);

      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      console.log(response);
      if (response.data.status) {
        Cookies.set("authToken", response.data.token, { expires: 7 });
        setAuthToken(response.data.token);
        router.push("/dashboard");
        toast.success("Login successful");
      } else {
        toast.error("Login failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    password_confirmation: string
  ) => {
    setIsLoading(true);
    try {
      console.log(email);

      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation,
      });
      console.log(response);
      // toast.success("Login successful");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsLoading(true);
    setAuthToken(null);
    Cookies.remove("authToken");
    router.push("/auth");
    setIsLoading(false);
    toast.success("User logged out");
  };

  const getProducts = async () => {
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    console.log("response:", response);
    if (response.status) {
      setProducts(response.data.products);
    }
  };

  useEffect(() => {
    // console.log("isLoading:", isLoading);
    getProducts();
  }, [products]);
  return (
    <AppContext.Provider
      value={{
        login,
        register,
        isLoading,
        authToken,
        setIsLoading,
        logout,
        getProducts,
        products,
      }}
    >
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export const MyAppHook = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("Context must be used inside the AppProvider");
  }

  return context;
};
