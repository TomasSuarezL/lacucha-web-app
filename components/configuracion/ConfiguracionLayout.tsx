import { Flex, Stack, Link as ChakraLink, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../shared/Layout";

const ConfiguracionNavBarLink = ({ url, name }) => {
  const router = useRouter();

  return (
    <Link href={url}>
      <ChakraLink
        display="flex"
        flexDirection={["column", "row"]}
        alignItems={["center"]}
        fontSize={["sm", "sm", , "medium"]}
        _hover={{ bg: "gray.200" }}
        fontWeight={router.asPath.includes(url) && "bold"}
        px={[2, 4]}
        py={[1, 2]}
      >
        {name}
      </ChakraLink>
    </Link>
  );
};

export default function ConfiguracionLayout({ children }) {
  return (
    <Flex direction={["column", "column", "row"]} height="full">
      <Stack direction={["row", "row", "column"]} spacing={[4]} mr={[2, 4, 8]} mt={[1, 2, 4]}>
        <ConfiguracionNavBarLink url="/configuracion/ejercicios" name="Ejercicios" />
        <ConfiguracionNavBarLink url="/configuracion/plantillas" name="Plantillas" />
      </Stack>
      {children}
    </Flex>
  );
}
