import { Alert, AlertIcon, AlertTitle, Center, Container, Flex } from "@chakra-ui/react";
import Head from "next/head";
import React, { useEffect } from "react";
import { useError } from "../hooks/useError";
import NavBar from "./Navbar";
import SideNav from "./SideNav";

export default function Layout({ children }) {
  const error = useError();

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
          direction={["column", "row"]}
          w="full"
          maxWidth="8xl"
          p={["2", "4"]}
          pt={["24", "24"]}
        >
          <SideNav />
          {error?.error ? (
            <Alert h={["12", "16"]} status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{error.error}</AlertTitle>
            </Alert>
          ) : (
            <Flex flex="1" p={["3", "4"]}>
              {children}
            </Flex>
          )}
        </Flex>
      </Center>
    </div>
  );
}
