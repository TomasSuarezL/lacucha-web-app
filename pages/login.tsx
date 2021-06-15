import Head from "next/head";
import Router from "next/router";
import { Box, Progress, Flex, Center } from "@chakra-ui/react";
import React from "react";
import SignInScreen from "../services/firebase";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const auth = useAuth();

  if (auth.user) Router.push("/");

  return (
    <div>
      <Head>
        <title>La Cucha</title>
        <link rel="icon" href="/logo_simple_negro_sin_padding.png" />
      </Head>
      {auth.loading || auth.user ? (
        <Progress position="absolute" top="0" width="full" size="xs" isIndeterminate />
      ) : (
        <Box
          position="absolute"
          top="0"
          w="full"
          h={[null, "100vh"]}
          minHeight="100vh"
          bg="url('/login.jpg') no-repeat center /cover"
        >
          <Flex direction="row" justify="flex-end" w="full" h="full" bg="#4f4f4f60">
            <Center flex="1" display={["none", "flex"]}>
              {/* <Image src="/logo_completo_blanco.png" width="500" height="500"></Image> */}
            </Center>
            <Box w={["full", "md", "lg", "xl"]} bg="gray.800" boxShadow="dark-lg">
              <SignInScreen />
            </Box>
          </Flex>
        </Box>
      )}
    </div>
  );
}
