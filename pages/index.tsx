import { Box, Text, Spacer, Heading, Progress, Flex, Avatar, Container, Stack } from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import Layout from "../components/shared/Layout";
import DataField from "../components/shared/DataField";
import { User } from "../types/Usuario.type";

export default function Perfil() {
  const auth = useAuth();

  const UserData = () => {
    const { email, uid, username, nombre, apellido, imgUrl, peso, altura, genero, nivel } = auth.user as User;
    return (
      <Flex
        direction={["column"]}
        align="center"
        m="auto"
        boxShadow="xl"
        p={["4", "6"]}
        bg="white"
        w={["full", "fit-content"]}
      >
        <Flex direction="column" w="full" align="center">
          <Avatar size="2xl" name={nombre} src={imgUrl}></Avatar>
          <Heading size="lg">{`${nombre} ${apellido}`}</Heading>
          <Text as="em" fontSize="xl">{`${username}`}</Text>
        </Flex>
        <Spacer p={["2"]}></Spacer>
        <Flex direction={["column", "row"]} wrap="wrap" justify="center" w="full">
          <DataField m={[1]} value={email} label={"Email"} w="full" />
          <Flex direcion={["column", "row"]} w="full">
            <DataField m={[1]} value={altura.toString() + " m."} label={"Altura"} w="full" />
            <DataField m={[1]} value={peso.toString() + " Kg."} label={"Peso"} w="full" />
          </Flex>
          <DataField m={[1]} value={genero.descripcion} label={"Genero"} w="full" />
          <DataField m={[1]} value={nivel.descripcion} label={"Nivel"} w="full" />
        </Flex>
      </Flex>
    );
  };

  return (
    <Layout>
      {auth.user && (
        <Box as="main" w="full">
          <UserData />
        </Box>
      )}
    </Layout>
  );
}
6;
