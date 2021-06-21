import React from "react";
import Image from "next/image";
import { Box, Button, Divider, Flex, Input } from "@chakra-ui/react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import "firebase/auth";

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const SignInScreen = () => {
  return (
    <Flex direction="column" align="center" h="full" p={[1, 2, 4]}>
      <Box my="4">
        <Image src="/logo_completo_blanco.png" width="300" height="300"></Image>
      </Box>
      <Flex display="flex" flex="1" flexDirection="column" w="full" p="4" align="center">
        <Input
          m="6"
          maxWidth="md"
          variant="filled"
          placeholder="Usuario"
          color="gray.100"
          bg="gray.700"
          _placeholder={{ color: "gray.200" }}
          _focus={{ bg: "gray.500" }}
          _hover={{ bg: "gray.600" }}
        />
        <Input
          m="6"
          maxWidth="md"
          type="password"
          variant="filled"
          placeholder="Password"
          color="gray.100"
          bg="gray.700"
          _placeholder={{ color: "gray.200" }}
          _focus={{ bg: "gray.500" }}
          _hover={{ bg: "gray.600" }}
        />
        <Button bg="gray.600" color="gray.100" _hover={{ bg: "gray.500" }} m="4">
          Ingresar
        </Button>
      </Flex>
      <Divider m="2"></Divider>
      <Box m="4">
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </Box>
    </Flex>
  );
};

export default SignInScreen;
