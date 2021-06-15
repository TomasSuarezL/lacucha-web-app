import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Box, Spacer, Button, Menu, MenuButton, MenuList, MenuItem, Avatar, Flex } from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";

const NavBar = () => {
  const auth = useAuth();

  return (
    <Box
      position="absolute"
      top="0"
      left="0"
      w="full"
      display="flex"
      flexDirection="row"
      alignItems="center"
      p={1}
      bg="gray.800"
    >
      <Link href="/">
        <Flex ml={[1, 2, 4]} cursor="pointer">
          <Image src="/logo_simple_blanco.png" width="72" height="72"></Image>
        </Flex>
      </Link>
      <Spacer />
      {auth.user && (
        <Menu>
          <MenuButton mr="3" py="1" px="2" height="fit-content" as={Button} rightIcon={<ChevronDownIcon />}>
            <Flex flexDirection="row" alignItems="center">
              <Avatar mr="3" size="sm" name={auth.user.displayName} src={auth.user.photoURL} />
              {auth.user.displayName}
            </Flex>
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Link href="/">Mi Perfil</Link>
            </MenuItem>
            <MenuItem onClick={() => auth.signout()}>Sign Out</MenuItem>
          </MenuList>
        </Menu>
      )}
    </Box>
  );
};

export default NavBar;
