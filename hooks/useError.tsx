import { createContext, Dispatch, SetStateAction, useState, useContext } from "react";

export interface Error {
  // The error message to show
  message: string;
  // flag to quickly check if there is an error
  isError: boolean;
  // If the error allows to still show the content, we should render it (for example, retry form submition)
  showContent?: boolean;
}

const ErrorContext =
  createContext<{ error: Error; setError: Dispatch<SetStateAction<Error>>; clearError: () => void }>(null);

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideError({ children }) {
  const error = useErrorHook();
  return <ErrorContext.Provider value={error}>{children}</ErrorContext.Provider>;
}

export const useError = () => {
  return useContext(ErrorContext);
};

export const useErrorHook: () => {
  error: Error;
  setError: Dispatch<SetStateAction<Error>>;
  clearError: () => void;
} = () => {
  const [error, setError] = useState<Error>({ message: "", showContent: true, isError: false });

  const clearError = () => {
    error.isError && setError({ message: "", showContent: true, isError: false });
  };

  return { error, setError, clearError };
};
