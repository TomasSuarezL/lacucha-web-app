import { Button, CloseButton, Divider, Flex, Spacer, Stack, Text } from "@chakra-ui/react";
import { AxiosError } from "axios";
import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { useMutation } from "react-query";
import { useError } from "../../hooks/useError";
import { useMesociclos } from "../../hooks/useMesociclos";
import { Mesociclo } from "../../models/Mesociclo";
import { DeleteButton } from "../shared/Buttons";
import DataField from "../shared/DataField";
import { mesociclosApi } from "../../apis/Mesociclo.api";
import { sesionesApi } from "../../apis/Sesion.api";
import { SesionDetail } from "./SesionDetail";
import { SesionesTable } from "./SesionTable";
import { Sesion } from "../../models/Sesion";

interface MesocicloDetailProps {
  mesociclo: Mesociclo;
  onClickCloseMesociclo: () => void;
}

export const MesocicloDetail: React.FC<MesocicloDetailProps> = ({
  mesociclo,
  onClickCloseMesociclo,
}) => {
  const [sesion, setSesion] = useState<Sesion | null>(null);
  const { updateSesion, deleteSesion, updateMesociclo } = useMesociclos(
    mesociclo.usuario.idUsuario
  );
  const { setError, clearError } = useError();
  const updateSesionMutation = useMutation((sesion: Sesion) => sesionesApi.putSesion(sesion), {
    onSuccess: (data) => {
      clearError();
      mesociclo.sesiones[mesociclo.sesiones.findIndex((s) => s.idSesion === sesion.idSesion)] =
        data;
      updateSesion(data);
    },
    onError: (err: AxiosError) => {
      console.error(err.response);
      setError({
        message: "No se pudo actualizar la sesión. Revisá los datos cargados, por favor.",
        isError: true,
        showContent: true,
      });
    },
  });
  const createSesionMutation = useMutation((sesion: Sesion) => sesionesApi.postSesion(sesion), {
    onSuccess: (data) => {
      clearError();
      mesociclo.sesiones.push(data);
      setSesion(null);
    },
    onError: (err: AxiosError) => {
      console.error(err.response);
      setError({
        message: "No se pudo crear la sesión. Revisá los datos cargados, por favor.",
        isError: true,
        showContent: true,
      });
    },
  });
  const deleteSesionMutation = useMutation(
    (sesion: Sesion) => sesionesApi.deleteSesion(sesion.idSesion),
    {
      onSuccess: () => {
        clearError();
        mesociclo.sesiones = mesociclo.sesiones.filter((s) => s.idSesion !== sesion.idSesion);
        deleteSesion(sesion.idSesion);
        setSesion(null);
      },
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "Ocurrió un error al eliminar la sesión.",
          isError: true,
          showContent: true,
        });
      },
    }
  );

  const updateMesociclcoMutation = useMutation(
    (mesociclo: Mesociclo) => mesociclosApi.putMesociclo(mesociclo.cancelar()),
    {
      onSuccess: (data) => {
        clearError();
        updateMesociclo(data);
        onClickCloseMesociclo();
      },
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "Ocurrió un error al cancelar el mesociclo.",
          isError: true,
          showContent: true,
        });
      },
    }
  );

  const onClickCloseSesion = () => {
    setSesion(null);
  };

  const onSesionAdd = () => {
    let _sesion = new Sesion(mesociclo.sesiones.length + 1, mesociclo.idMesociclo);
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
          <Stack
            direction={["column", "column", "column", "row"]}
            m={[1, 2, 3]}
            spacing={["2", "3"]}
          >
            <DataField value={mesociclo.objetivo?.descripcion} label="Objetivo" w="full" />
            <DataField value={mesociclo.organizacion?.descripcion} label="Organización" w="full" />
            <DataField value={mesociclo.nivel?.descripcion} label="Nivel" w="full" />
          </Stack>
          <Stack
            direction={["column", "column", "column", "column", "row"]}
            m={[1, 2, 3]}
            spacing={["2", "3"]}
          >
            <Stack direction={["column", "row"]}>
              <DataField
                value={mesociclo.semanasPorMesociclo?.toString()}
                label="Semanas por Mesociclo"
                w="full"
              />
              <DataField
                value={mesociclo.sesionesPorSemana?.toString()}
                label="Sesiones por Semana"
                w="full"
              />
            </Stack>
            <DataField
              value={mesociclo.principalTrenSuperior?.nombre}
              label="Ejercicio Principal Tren Superior"
              w="full"
            />
            <DataField
              value={mesociclo.principalTrenInferior?.nombre}
              label="Ejercicio Principal Tren Inferior"
              w="full"
            />
          </Stack>
          {mesociclo.estaFinalizado() && (
            <>
              <Divider my={[1, 2, 4]} />
              <Stack
                direction={["column", "column", "column", "row"]}
                m={[1, 2, 3]}
                spacing={["2", "3"]}
              >
                <DataField
                  value={mesociclo.aumentoMotivacion ? "Si" : "No"}
                  label="Aumento Motivación?"
                />
                <DataField
                  value={mesociclo.masCercaObjetivos ? "Si" : "No"}
                  label="Más Cerca de Objetivos?"
                />
                <DataField
                  value={mesociclo.sentimiento?.toString()}
                  label="Cómo te sentiste? (1 a 5)"
                />
                <DataField value={mesociclo.durmiendo?.toString()} label="Cómo dormiste? (1 a 5)" />
                <DataField
                  value={mesociclo.alimentado?.toString()}
                  label="Cómo te alimentaste? (1 a 5)"
                />
              </Stack>
            </>
          )}
          <Divider my={[1, 2, 4]} />
          <Flex align="center">
            <Text fontSize={["lg", "xl"]} mx={[2, 2, 4]} alignSelf="flex-start">
              Sesiones
            </Text>
            <Spacer />
            {mesociclo.semanasPorMesociclo * mesociclo.sesionesPorSemana !=
              mesociclo.sesiones.length && (
              <Text color="red.300">{`Hay ${
                mesociclo.sesiones.length
              } sesiones activas y deberían ser ${
                mesociclo.semanasPorMesociclo * mesociclo.sesionesPorSemana
              }.`}</Text>
            )}
            {mesociclo.estaActivo() && (
              <Button size="sm" mx={[1, 2]} onClick={() => onSesionAdd()}>
                <AiOutlinePlus /> Agregar Sesión
              </Button>
            )}
          </Flex>
          <Spacer m={[1, 2]} />
          <SesionesTable sesiones={mesociclo.sesiones} setSesion={setSesion} />
          <Spacer m={[1, 2]} />
          {mesociclo.estaActivo() && (
            <Flex>
              <Spacer />
              <DeleteButton
                onClick={() => updateMesociclcoMutation.mutate(mesociclo)}
                isLoading={updateMesociclcoMutation.isLoading}
                loadingText="Cancelando..."
              >
                Cancelar Mesociclo
              </DeleteButton>
            </Flex>
          )}
        </>
      ) : (
        <SesionDetail
          sesion={sesion}
          onSave={
            sesion.idSesion
              ? (sesion: Sesion) => updateSesionMutation.mutate(sesion)
              : (sesion: Sesion) => createSesionMutation.mutate(sesion)
          }
          onDelete={(sesion: Sesion) => deleteSesionMutation.mutate(sesion)}
          isLoading={
            updateSesionMutation.isLoading ||
            createSesionMutation.isLoading ||
            deleteSesionMutation.isLoading
          }
          isNew={!sesion.idSesion}
          isReadOnly={!mesociclo.estaActivo()}
        />
      )}
    </Flex>
  );
};
