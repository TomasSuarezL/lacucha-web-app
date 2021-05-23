import { Box, Flex, Progress } from "@chakra-ui/react";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useError } from "../../hooks/useError";
import { Usuario } from "../../types/Usuario.type";
import { UsuarioDetail } from "./UsuarioDetail";
import { usuariosApi } from "./Usuarios.api";
import { UsuariosSearch } from "./UsuariosSearch";
import { UsuariosTable } from "./UsuariosTable";

const UsuariosMain: React.FC<{ setUsuario: React.Dispatch<React.SetStateAction<Usuario>> }> = ({
  setUsuario,
}) => {
  const { setError } = useError();
  const [search, setSearch] = useState<String>("");
  const [searchQuery, setSearchQuery] = useState<String>("");
  const { isLoading, isFetching, isSuccess, data, isError, error } = useQuery(["usuarios", searchQuery], () =>
    usuariosApi.getUsuarios(search)
  );

  if (isLoading) {
    return <Progress position="absolute" top="0" left="0" width="100vw" size="xs" isIndeterminate />;
  }

  if (isError) {
    const errorString = typeof error === "string" ? error : "Error obtener usuarios";
    setError(errorString);
    return <Box></Box>;
  }

  if (isSuccess) {
    setError("");
  }

  console.log(data);

  return (
    <>
      <UsuariosSearch search={search} setSearch={setSearch} setSearchQuery={setSearchQuery} />
      <UsuariosTable usuarios={data} setUsuario={setUsuario} />
    </>
  );
};

export const Usuarios = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  return (
    <Flex direction="column" as="main" w="full">
      {usuario ? (
        <UsuarioDetail usuario={usuario} onClickCloseUsuario={() => setUsuario(null)} />
      ) : (
        <UsuariosMain setUsuario={setUsuario} />
      )}
    </Flex>
  );
};
