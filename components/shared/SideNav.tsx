import React from "react";
import Link from "next/link";
import { Stack, Link as ChakraLink } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { AiOutlineTeam, AiOutlineCalendar, AiOutlineBarChart, AiOutlineSetting } from "react-icons/ai";
import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();
  return (
    <Stack
      direction={["row", "column"]}
      display="flex"
      alignItems={["center", "flex-start"]}
      justifyContent={["center", "flex-start"]}
      px={[4, 6, 6, 6, 16]}
      py={[4, 16]}
      minWidth={[null, null, "2xs", "2xs"]}
      spacing={["8px", "24px"]}
    >
      <Link href="/usuarios">
        <ChakraLink
          display="flex"
          flexDirection={["column", "row"]}
          alignItems={["center"]}
          fontSize={["sm", "medium"]}
          _hover={{ bg: "gray.200" }}
          p={[0, 4]}
          w="full"
          bg={router.asPath === "/usuarios" && "gray.100"}
        >
          <Icon as={AiOutlineTeam} w={["4", "6"]} h={["4", "6"]} mr={["2", "5"]}></Icon>Usuarios
        </ChakraLink>
      </Link>
      <Link href="/mesociclos">
        <ChakraLink
          display="flex"
          flexDirection={["column", "row"]}
          alignItems={["center"]}
          fontSize={["sm", "medium"]}
          _hover={{ bg: "gray.200" }}
          p={[0, 4]}
          w="full"
          bg={router.asPath === "/mesociclos" && "gray.100"}
        >
          <Icon as={AiOutlineCalendar} w={["4", "6"]} h={["4", "6"]} mr={["2", "5"]}></Icon>Mesociclos
        </ChakraLink>
      </Link>
      <Link href="/dashboard">
        <ChakraLink
          display="flex"
          flexDirection={["column", "row"]}
          alignItems={["center"]}
          fontSize={["sm", "medium"]}
          _hover={{ bg: "gray.200" }}
          p={[0, 4]}
          w="full"
          bg={router.asPath === "/dashboard" && "gray.100"}
        >
          <Icon as={AiOutlineBarChart} w={["4", "6"]} h={["4", "6"]} mr={["2", "5"]}></Icon>Dashboard
        </ChakraLink>
      </Link>
      <Link href="/configuracion">
        <ChakraLink
          display="flex"
          flexDirection={["column", "row"]}
          alignItems={["center"]}
          fontSize={["sm", "medium"]}
          _hover={{ bg: "gray.200" }}
          p={[0, 4]}
          w="full"
          bg={router.asPath === "/configuracion" && "gray.100"}
        >
          <Icon as={AiOutlineSetting} w={["4", "6"]} h={["4", "6"]} mr={["2", "5"]}></Icon>Configuración
        </ChakraLink>
      </Link>
    </Stack>
  );
}
