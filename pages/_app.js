import { useRef } from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ChakraProvider } from "@chakra-ui/react";
import { ProvideAuth } from "../hooks/useAuth";
import { ProvideError } from "../hooks/useError";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const queryClientRef = useRef();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <ChakraProvider>
      <ProvideError>
        <ProvideAuth>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </ProvideAuth>
      </ProvideError>
    </ChakraProvider>
  );
}

export default MyApp;
