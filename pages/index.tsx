import { Box, Text, Spacer, Heading, Progress, Flex, Avatar, Container, Stack } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../hooks/useFirebaseUser";
import Layout from "../components/Layout";
import DataField from "../components/DataField";

export default function Perfil() {
  const auth = useAuth();

  const UserData = () => {
    const {
      user: { email, uid, username, nombre, apellido, imgUrl, peso, altura, genero, nivel },
    } = auth;
    return (
      <Flex direction="column" align="center" w="full" boxShadow="xl" p={["4", "6"]} bg="white">
        <Avatar size="2xl" name={nombre} src={imgUrl}></Avatar>
        <Heading size="lg">{`${nombre} ${apellido}`}</Heading>
        <Text as="em" fontSize="xl">{`${username}`}</Text>
        <Box p={["2"]}></Box>
        <Stack w="full" align="center" spacing="4">
          <DataField value={email} label={"Email"} />
          <Flex direction={["column", "column", "row"]} w="full">
            <DataField value={altura.toString() + " m."} label={"Altura"} />
            <Box m={["2", "2", "0"]} w="8"></Box>
            <DataField value={peso.toString() + " Kg."} label={"Peso"} />
          </Flex>
          <DataField value={genero.descripcion} label={"Genero"} />
          <DataField value={nivel.descripcion} label={"Nivel"} />
        </Stack>
      </Flex>
    );
  };

  return (
    <Layout>
      {auth.loading ? (
        <Progress position="absolute" top="0" width="full" size="xs" isIndeterminate />
      ) : (
        auth.user && (
          <Box as="main" w="full">
            <UserData />
          </Box>
        )
      )}
      <footer></footer>
    </Layout>
  );
}
