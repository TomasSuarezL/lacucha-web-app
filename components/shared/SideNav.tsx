import React from "react";
import Link from "next/link";
import { Stack, Link as ChakraLink } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import {
  AiOutlineTeam,
  AiOutlineCalendar,
  AiOutlineBarChart,
  AiOutlineSetting,
} from "react-icons/ai";
import { useRouter } from "next/router";

const NavBarLink = ({ url, name, icon }) => {
  const router = useRouter();

  return (
    <Link href={url}>
      <ChakraLink
        display="flex"
        flexDirection={["column", "row"]}
        alignItems={["center"]}
        fontSize={["sm", "sm", , "medium"]}
        _hover={{ bg: "gray.200" }}
        p={[1, 2, 3]}
        w="full"
        bg={"/" + router.asPath.split("/")[1] === url && "gray.100"}
      >
        <Icon as={icon} w={["4", "6"]} h={["4", "6"]} mr={["2", "5"]}></Icon>
        {name}
      </ChakraLink>
    </Link>
  );
};

export default function NavBar() {
  return (
    <Stack
      direction={["row", "column"]}
      display="flex"
      alignItems={["center", "flex-start"]}
      justifyContent={["center", "flex-start"]}
      px={[2, 2, 6, 6, 8]}
      py={[4, 16]}
      minWidth={[null, null, "2xs", "2xs"]}
      spacing={[0, 1, 2]}
    >
      <NavBarLink url="/usuarios" name="Usuarios" icon={AiOutlineTeam} />
      {/* <NavBarLink url="/mesociclos" name="Mesociclos" icon={AiOutlineCalendar} /> */}
      <NavBarLink url="/dashboard" name="Dashboard" icon={AiOutlineBarChart} />
      <NavBarLink url="/configuracion" name="Configuración" icon={AiOutlineSetting} />
    </Stack>
  );
}
