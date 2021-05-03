import { ChakraProvider } from "@chakra-ui/react";
import { ProvideAuth } from "../hooks/useFirebaseUser";
import { ProvideError } from "../hooks/useError";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ProvideError>
        <ProvideAuth>
          <Component {...pageProps} />
        </ProvideAuth>
      </ProvideError>
    </ChakraProvider>
  );
}

export default MyApp;
