import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { plainToClass } from "class-transformer";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  CloseButton,
  Flex,
  Spacer,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Layout from "../../../components/shared/Layout";
import { Mesociclo } from "../../../models/Mesociclo";
import Link from "next/link";
import { MesocicloNuevoForm } from "../../../components/mesociclos/MesocicloNuevoForm";
import { SesionDetail } from "../../../components/mesociclos/SesionDetail";
import { mesociclosApi } from "../../../apis/Mesociclo.api";
import { useError } from "../../../hooks/useError";
import { AxiosError } from "axios";
import { useUsuario } from "../../../hooks/useUsuario";
import { AiOutlinePlus } from "react-icons/ai";
import { useMesociclos } from "../../../hooks/useMesociclos";
import { SaveButton } from "../../../components/shared/Buttons";
import { Sesion } from "../../../models/Sesion";

const NuevoMesociclo = ({ usuario }) => {
  const router = useRouter();
  const [mesociclo, setMesociclo] = useState<Mesociclo>(new Mesociclo());
  const [sesionEdit, setSesionEdit] = useState<Sesion | null>(null);
  const [semana, setSemana] = useState<Sesion[] | null>(null);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const { setError, clearError } = useError();
  const queryClient = useQueryClient();
  const { data: mesociclos } = useMesociclos(usuario.idUsuario);
  const cancelRef = React.useRef();

  const createMutation = useMutation(
    (mesociclo: Mesociclo) => mesociclosApi.postMesociclo(mesociclo),
    {
      onSuccess: (data) => {
        clearError();
        let _old = queryClient.getQueryData(["mesociclos", usuario.idUsuario]);
        if (_old) {
          queryClient.setQueryData<Mesociclo[]>(["mesociclos", usuario.idUsuario], (old) => {
            return plainToClass(Mesociclo, [data, ...(old ? old : [])]);
          });
        }
        router.push(`/usuarios/${usuario.uuid}`);
      },
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "No se pudo crear la sesión. Revisá los datos cargados, por favor.",
          isError: true,
          showContent: true,
        });
      },
    }
  );

  const onSaveMesociclo = () => {
    mesociclo.usuario = usuario;
    mesociclo.nivel = usuario.nivel;
    if (mesociclos.filter((m) => m.estaActivo()).length > 0) {
      setIsAlertOpen(true);
    } else {
      createMutation.mutate(mesociclo);
    }
  };

  const onSaveSesionEdit = (sesion: Sesion) => {
    const _semana = semana.map((s) => (s.numSesion === sesion.numSesion ? sesion : s));
    setSemana(plainToClass(Sesion, _semana));
    setSesionEdit(null);
  };

  const onCopyMesociclo = () => {
    const ultimoMesociclo = mesociclos.reduce((prev, curr) =>
      prev.idMesociclo > curr.idMesociclo ? prev : curr
    );

    ultimoMesociclo
      ? setMesociclo(Mesociclo.copiarDe(ultimoMesociclo))
      : setError({
          message: "No se encontró un mesociclo anterior.",
          isError: true,
          showContent: true,
        });
  };

  if (createMutation.isLoading) {
    return <Spinner m={[2, 3, 4]} alignSelf="center" />;
  }

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
          {usuario?.nombre} {usuario?.apellido}
        </Text>
        <Spacer />
        <Button size="sm" mx={[1, 2]} onClick={onCopyMesociclo} isDisabled={!mesociclos}>
          <AiOutlinePlus /> <Text ml={[1]}>Copiar Mesociclo Anterior</Text>
        </Button>
        {sesionEdit ? (
          <CloseButton
            colorScheme="gray"
            size="md"
            variant="ghost"
            onClick={() => setSesionEdit(null)}
          ></CloseButton>
        ) : (
          <Link href={`/usuarios/${usuario.uuid}`}>
            <CloseButton colorScheme="gray" size="md" variant="ghost"></CloseButton>
          </Link>
        )}
      </Flex>
      {sesionEdit ? (
        <SesionDetail
          sesion={sesionEdit}
          isLoading={false}
          isNew={true}
          onSave={(sesion: Sesion) => onSaveSesionEdit(sesion)}
        />
      ) : (
        <MesocicloNuevoForm
          mesociclo={mesociclo}
          setMesociclo={setMesociclo}
          semana={semana}
          setSemana={setSemana}
          onSave={onSaveMesociclo}
          onClickSesion={(sesion: Sesion) => setSesionEdit(sesion)}
        />
      )}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Crear Mesociclo
            </AlertDialogHeader>

            <AlertDialogBody>
              El usuario ya tiene un mesociclo activo. Vas a crearlo igualmente?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                size="sm"
                variant="ghost"
                ref={cancelRef}
                onClick={() => setIsAlertOpen(false)}
              >
                Cancelar
              </Button>
              <SaveButton
                onClick={() => {
                  setIsAlertOpen(false);
                  createMutation.mutate(mesociclo);
                }}
                ml={3}
              >
                Crear
              </SaveButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default function NuevoMesocicloPage() {
  const [usuario, _] = useUsuario();
  return usuario ? <NuevoMesociclo usuario={usuario} /> : <Spinner />;
}
