import {
  Alert,
  AlertIcon,
  AlertTitle,
  Center,
  CloseButton,
  Flex,
  Progress,
} from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { useError } from "../../hooks/useError";
import { useAuth } from "../../hooks/useAuth";
import NavBar from "./Navbar";
import SideNav from "./SideNav";

export default function Layout({ children }) {
  const {
    error: { message, showContent, isError },
    clearError,
  } = useError();
  const auth = useAuth();

  return (
    <div>
      <Head>
        <title>La Cucha</title>
        <link rel="icon" href="/logo_simple_negro_sin_padding.png" />
      </Head>
      <NavBar></NavBar>
      <Center w="full" bg="gray.50">
        <Flex
          height={[null, "100vh"]}
          minHeight={"100vh"}
          direction={["column", "row"]}
          w="full"
          pt={["20", "20"]}
        >
          <SideNav />
          {isError && showContent === false ? (
            <Alert h={["8", "12"]} m={[2, 3, 4]} flex={["0", "1"]} w={["auto"]} status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{message}</AlertTitle>
            </Alert>
          ) : auth.loading ? (
            <Progress
              position="absolute"
              top="0"
              left="0"
              width="100vw"
              size="xs"
              isIndeterminate
            />
          ) : (
            auth.user && (
              <Flex flex="1" p={[1, 2, 4]} direction="column" maxWidth="7xl" overflow="auto">
                {isError && showContent && (
                  <Alert minHeight={["8", "12"]} status="error">
                    <AlertIcon />
                    <AlertTitle mr={2}>{message}</AlertTitle>
                    <CloseButton
                      position="absolute"
                      right="8px"
                      top="8px"
                      onClick={() => clearError()}
                    />
                  </Alert>
                )}
                {children}
              </Flex>
            )
          )}
        </Flex>
      </Center>
      <footer></footer>
    </div>
  );
}
