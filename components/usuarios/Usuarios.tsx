import { Box, Flex, Progress } from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useError } from "../../hooks/useError";
import { usuariosApi } from "./Usuarios.api";
import { UsuariosSearch } from "./UsuariosSearch";
import { UsuariosTable } from "./UsuariosTable";

export const Usuarios = () => {
  const { setError, clearError } = useError();
  const [search, setSearch] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<String>("");
  const { isLoading, isFetching, isSuccess, data, isError, error } = useQuery(
    ["usuarios", searchQuery],
    () => usuariosApi.getUsuarios(search),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 15, // 15 min
      staleTime: 1000 * 60 * 60 * 15, // 15 min
    }
  );

  if (isLoading) {
    return <Progress position="absolute" top="0" left="0" width="100vw" size="xs" isIndeterminate />;
  }

  if (isError) {
    const errorString = typeof error === "string" ? error : "Error obtener usuarios";
    setError({ message: errorString, showContent: false, isError: true });
    return <Box></Box>;
  }

  if (isSuccess) {
    clearError();
  }

  return (
    <Flex direction="column" as="main" w="full">
      <>
        <UsuariosSearch search={search} setSearch={setSearch} setSearchQuery={setSearchQuery} />
        <UsuariosTable usuarios={data} />
      </>
    </Flex>
  );
};
