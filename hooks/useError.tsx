import { createContext, Dispatch, SetStateAction, useState, useContext } from "react";

const ErrorContext = createContext<{ error: string; setError: Dispatch<SetStateAction<string>> }>(null);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideError({ children }) {
  const error = useErrorHook();
  return <ErrorContext.Provider value={error}>{children}</ErrorContext.Provider>;
}

export const useError = () => {
  return useContext(ErrorContext);
};

export const useErrorHook: () => { error: string; setError: Dispatch<SetStateAction<string>> } = () => {
  const [error, setError] = useState("");

  return { error, setError };
};
