import { Alert, AlertIcon, AlertTitle, Box, Center, Container, Flex, Progress } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { useError } from "../../hooks/useError";
import { useAuth } from "../../hooks/useAuth";
import NavBar from "./Navbar";
import SideNav from "./SideNav";

export default function Layout({ children }) {
  const error = useError();
  const auth = useAuth();

  return (
    <div>
      <Head>
        <title>La Cucha</title>
        <link rel="icon" href="/logo_simple_negro_sin_padding.png" />
      </Head>
      <NavBar></NavBar>
      <Center w="full" bg="gray.50">
        <Flex height={[null, "100vh"]} direction={["column", "row"]} w="full" pt={["24", "24"]}>
          <SideNav />
          {error?.error ? (
            <Alert h={["12", "16"]} status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{error.error}</AlertTitle>
            </Alert>
          ) : auth.loading ? (
            <Progress position="absolute" top="0" left="0" width="100vw" size="xs" isIndeterminate />
          ) : (
            auth.user && (
              <Box flex="1" overflow="auto">
                <Flex flex="1" p={["3", "4"]} maxWidth="7xl">
                  {children}
                </Flex>
              </Box>
            )
          )}
        </Flex>
      </Center>
      <footer></footer>
    </div>
  );
}
