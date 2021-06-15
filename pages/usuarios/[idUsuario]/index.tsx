import React, { useState } from "react";
import {
  Avatar,
  CloseButton,
  Divider,
  Flex,
  Spacer,
  Progress,
  Stack,
  Text,
  Box,
} from "@chakra-ui/react";
import { MesocicloDetail } from "../../../components/mesociclos/MesocicloDetail";
import { SaveButton } from "../../../components/shared/Buttons";
import { InputLabeled, NumberInputLabeled, SelectLabeled } from "../../../components/shared/Inputs";
import { UsuarioMesociclos } from "../../../components/usuarios/UsuarioMesociclos";
import { Mesociclo } from "../../../models/Mesociclo";
import { Niveles } from "../../../types/Usuario.type";
import { useRouter } from "next/router";
import { useUsuario } from "../../../hooks/useUsuario";
import Layout from "../../../components/shared/Layout";

interface UsuarioDatosProps {
  onClickCloseUsuario: () => void;
  setMesociclo: React.Dispatch<React.SetStateAction<Mesociclo>>;
}

const UsuarioDatos = ({ onClickCloseUsuario, setMesociclo }: UsuarioDatosProps) => {
  const [usuario, setUsuario, updateUsuario, isUpdating] = useUsuario();

  const onChangeNivel = (value: string) => {
    setUsuario({
      ...usuario,
      nivel: Niveles.filter((n) => n.idNivel.toString() === value)[0],
    });
  };

  return usuario ? (
    <Flex direction="column" m={[1, 6]} p={[3, 4, 6]} bg="white" boxShadow="lg">
      <Flex direction="row" justify="flex-end" m={[1]}>
        <Spacer />
        <CloseButton
          colorScheme="gray"
          size="sm"
          variant="ghost"
          onClick={onClickCloseUsuario}
        ></CloseButton>
      </Flex>
      <Flex direction={["column", "column", "column", "row"]} pb={[1, 3]}>
        {/* Columna Avatar + Email + username + Nivel */}
        <Stack direction="column" p={[1, 1, 2]} align="center" spacing={[1]}>
          <Avatar size="2xl" m={[1, 2, 3]} name={usuario.nombre} src={usuario.imgUrl}></Avatar>
          <Text fontWeight="bold" fontSize={["xs", "sm"]}>
            {usuario.email}
          </Text>
          <Text fontWeight="ligth" fontSize={["xs", "sm"]} as="em">
            {usuario.username}
          </Text>
        </Stack>
        <Spacer px={[2, 3]} />
        {/* Columna Datos */}
        <Stack direction="column" p={[1, 1, 2]} spacing={[1, 2]} w="full">
          {/* Nombre + Apellido */}
          <Flex direction={["column", "column", "row"]} w="full">
            <InputLabeled
              value={usuario.nombre}
              onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
              label="Nombre"
            ></InputLabeled>
            <Spacer p={[0, 0, 2]} my={[1, 1, 0]} />
            <InputLabeled
              value={usuario.apellido}
              onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
              label="Apellido"
            ></InputLabeled>
          </Flex>
          {/* Genero + Peso + Altura*/}
          <Flex direction={["column", "column", "row"]} w="full">
            <InputLabeled
              value={usuario.genero.descripcion}
              label="Genero"
              isReadOnly
            ></InputLabeled>
            <Spacer p={[0, 0, 2]} my={[1, 1, 0]} />
            <NumberInputLabeled
              value={usuario.peso}
              onChangeNumber={(_s: string, v: number) => setUsuario({ ...usuario, peso: v })}
              step={0.5}
              label="Peso (Kg.)"
            ></NumberInputLabeled>
            <Spacer p={[0, 0, 2]} my={[1, 1, 0]} />
            <NumberInputLabeled
              value={usuario.altura}
              onChangeNumber={(_s: string, v: number) => setUsuario({ ...usuario, altura: v })}
              step={0.01}
              label="Altura (m.)"
            ></NumberInputLabeled>
          </Flex>
          {/* Fecha Nacimiento + Fecha Alta */}
          <Flex direction={["column", "column", "row"]} w="full">
            <SelectLabeled
              label="Nivel"
              value={usuario.nivel.idNivel}
              onChange={(e) => onChangeNivel(e.target.value)}
              options={Niveles.map((n) => ({
                key: n.descripcion,
                value: n.idNivel,
                description: n.descripcion,
              }))}
            />
            <Spacer p={[0, 0, 2]} my={[1, 1, 0]} />
            <InputLabeled
              value={
                usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento)?.toLocaleString() : "-"
              }
              label="Fecha Nacimiento"
              isReadOnly
            ></InputLabeled>
            <Spacer p={[0, 0, 2]} my={[1, 1, 0]} />
            <InputLabeled
              value={new Date(usuario.creadoEn)?.toLocaleString()}
              label="Fecha Alta"
              isReadOnly
            ></InputLabeled>
          </Flex>
          <Box p={[1]} />
          <SaveButton
            mx={[1, 1, 2]}
            onClick={() => updateUsuario(usuario)}
            isLoading={isUpdating}
            loadingText="Actualizando..."
          >
            Guardar Datos
          </SaveButton>
        </Stack>
      </Flex>
      <Divider my={[1, 2, 4]} />
      <UsuarioMesociclos usuario={usuario} setMesociclo={setMesociclo} />
    </Flex>
  ) : (
    <Progress position="absolute" top="0" left="0" width="100vw" size="xs" isIndeterminate />
  );
};

const UsuarioDetail = () => {
  const router = useRouter();
  const [mesociclo, setMesociclo] = useState<Mesociclo | null>(null);

  return (
    <Flex direction="column" flex="1">
      {!mesociclo ? (
        <UsuarioDatos
          onClickCloseUsuario={() => router.push("/usuarios")}
          setMesociclo={setMesociclo}
        />
      ) : (
        <MesocicloDetail
          mesociclo={mesociclo}
          onClickCloseMesociclo={() => setMesociclo(null)}
        ></MesocicloDetail>
      )}
    </Flex>
  );
};

export default UsuarioDetail;
