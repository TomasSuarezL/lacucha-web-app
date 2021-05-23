import { SearchIcon } from "@chakra-ui/icons";
import { Flex, Input, IconButton } from "@chakra-ui/react";
import React from "react";

interface UsuariosSearchProps {
  search: String;
  setSearch: React.Dispatch<React.SetStateAction<String>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<String>>;
}

export const UsuariosSearch: React.FC<UsuariosSearchProps> = ({ search, setSearch, setSearchQuery }) => {
  return (
    <Flex alignSelf="flex-end" my={[3, 5]} p={[3, 5]} bg="white" boxShadow="xl">
      <Input
        value={search.toString()}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar Usuario"
        focusBorderColor="gray.400"
        borderRadius="0"
      />
      <IconButton
        aria-label="Search database"
        borderRadius="0"
        icon={<SearchIcon />}
        onClick={() => setSearchQuery(search)}
      />
    </Flex>
  );
};
