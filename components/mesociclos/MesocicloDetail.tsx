import {
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  Spacer,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useQueryClient } from "react-query";
import { useMesociclos } from "../../hooks/useMesociclos";
import { Mesociclo, Sesion } from "../../models/Mesociclo";
import DataField from "../shared/DataField";
import { SesionDetail } from "./SesionDetail";

interface SesionTableProps {
  sesiones: Sesion[];
  setSesion: React.Dispatch<React.SetStateAction<Sesion>>;
}

const SesionesTable = ({ sesiones, setSesion }: SesionTableProps) => {
  return (
    <Box w="full">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Fecha</Th>
            <Th>Fecha Fin</Th>
            <Th display={["none", "table-cell"]} isNumeric>
              # Bloques
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {sesiones.map((s) => (
            <Tr key={s.idSesion} cursor="pointer" _hover={{ bg: "gray.100" }} onClick={() => setSesion(s)}>
              <Td>{new Date(s.fechaEmpezado).toLocaleString()}</Td>
              <Td>{s.fechaFinalizado ? new Date(s.fechaFinalizado).toLocaleString() : "-"}</Td>
              <Td display={["none", "table-cell"]} isNumeric>
                {s.bloques?.length}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

interface MesocicloDetailProps {
  mesociclo: Mesociclo;
  onClickCloseMesociclo: () => void;
}

export const MesocicloDetail: React.FC<MesocicloDetailProps> = ({ mesociclo, onClickCloseMesociclo }) => {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const { updateSesion } = useMesociclos(mesociclo.usuario.idUsuario);

  const onClickCloseSesion = () => {
    setSesion(null);
  };

  const onUpdateMesocicloSesion = (sesion: Sesion) => {
    mesociclo.sesiones[mesociclo.sesiones.findIndex((s) => s.idSesion === sesion.idSesion)] = sesion;
    updateSesion(sesion);
  };

  const onSesionAdd = () => {
    let _sesion = new Sesion();
    setSesion(_sesion);
  };

  return (
    <Flex direction="column" m={[1, 6]} p={[3, 4, 6]} bg="white" boxShadow="lg">
      <Flex direction="row" justify="flex-end" m={[2, 3]}>
        <Text
          borderLeft="4px solid"
          borderColor="gray.200"
          fontSize={["sm", "lg"]}
          pl={[1, 2, 3]}
          alignSelf="flex-start"
        >
          {mesociclo.usuario.nombre} {mesociclo.usuario.apellido}
        </Text>
        <Spacer />
        <CloseButton
          colorScheme="gray"
          size="md"
          variant="ghost"
          onClick={sesion ? onClickCloseSesion : onClickCloseMesociclo}
        ></CloseButton>
      </Flex>
      <Text fontSize={["xl", "2xl"]} fontWeight="semibold" mx={[2, 2, 4]} alignSelf="flex-start">
        {`Mesociclo del ${new Date(mesociclo.creadoEn).toLocaleDateString()} al ${
          mesociclo.fechaFinReal
            ? mesociclo.fechaFinReal.toLocaleDateString()
            : mesociclo.getFechaFinalizacion().toLocaleDateString()
        }`}
      </Text>
      <Text fontSize={["sm", "lg"]} mx={[2, 2, 4]} alignSelf="flex-start">
        <em>Estado: </em>
        {mesociclo.estado.descripcion}
      </Text>
      <Spacer m={[1, 2]} />
      {!sesion ? (
        <>
          <Stack direction={["column", "column", "row"]} m={[1, 2, 3]} spacing={["2", "3"]}>
            <DataField value={mesociclo.objetivo?.descripcion} label="Objetivo" />
            <DataField value={mesociclo.organizacion?.descripcion} label="Organización" />
            <DataField value={mesociclo.nivel?.descripcion} label="Nivel" />
          </Stack>
          <Stack direction={["column", "column", "row"]} m={[1, 2, 3]} spacing={["2", "3"]}>
            <DataField value={mesociclo.semanasPorMesociclo?.toString()} label="Semanas por Mesociclo" />
            <DataField value={mesociclo.sesionesPorSemana?.toString()} label="Sesiones por Semana" />
            <DataField
              value={mesociclo.principalTrenSuperior?.nombre}
              label="Ejercicio Principal Tren Superior"
            />
            <DataField
              value={mesociclo.principalTrenInferior?.nombre}
              label="Ejercicio Principal Tren Inferior"
            />
          </Stack>
          {mesociclo.estaFinalizado() && (
            <>
              <Divider my={[1, 2, 4]} />
              <Stack direction={["column", "column", "row"]} m={[1, 2, 3]} spacing={["2", "3"]}>
                <DataField value={mesociclo.aumentoMotivacion ? "Si" : "No"} label="Aumento Motivación?" />
                <DataField
                  value={mesociclo.masCercaObjetivos ? "Si" : "No"}
                  label="Más Cerca de Objetivos?"
                />
                <DataField value={mesociclo.sentimiento?.toString()} label="Cómo te sentiste? (1 a 5)" />
                <DataField value={mesociclo.durmiendo?.toString()} label="Cómo dormiste? (1 a 5)" />
                <DataField value={mesociclo.alimentado?.toString()} label="Cómo te alimentaste? (1 a 5)" />
              </Stack>
            </>
          )}
          <Divider my={[1, 2, 4]} />
          <Flex>
            <Text fontSize={["lg", "xl"]} mx={[2, 2, 4]} alignSelf="flex-start">
              Sesiones
            </Text>
            <Spacer />
            <Button size="sm" mx={[1, 2]} onClick={() => onSesionAdd()}>
              <AiOutlinePlus /> Agregar Sesión
            </Button>
          </Flex>
          <Spacer m={[1, 2]} />
          <SesionesTable sesiones={mesociclo.sesiones} setSesion={setSesion} />
        </>
      ) : (
        <SesionDetail sesion={sesion} updateSesion={onUpdateMesocicloSesion} />
      )}
    </Flex>
  );
};
