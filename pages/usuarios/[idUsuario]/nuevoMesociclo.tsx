import { useRouter } from "next/router";
import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { plainToClass } from "class-transformer";
import { CloseButton, Flex, Spacer, Spinner, Text } from "@chakra-ui/react";
import Layout from "../../../components/shared/Layout";
import { Mesociclo, Sesion } from "../../../models/Mesociclo";
import Link from "next/link";
import { MesocicloNuevoForm } from "../../../components/mesociclos/MesocicloNuevoForm";
import { SesionDetail } from "../../../components/mesociclos/SesionDetail";
import { mesociclosApi } from "../../../components/mesociclos/Mesociclo.api";
import { useError } from "../../../hooks/useError";
import { AxiosError } from "axios";
import { useUsuario } from "../../../hooks/useUsuario";

const NuevoMesociclo = () => {
  const router = useRouter();
  const [mesociclo, setMesociclo] = useState<Mesociclo>(new Mesociclo());
  const [sesionEdit, setSesionEdit] = useState<Sesion | null>(null);
  const [semana, setSemana] = useState<Sesion[] | null>(null);
  const { setError, clearError } = useError();
  const [usuario, _] = useUsuario();
  const queryClient = useQueryClient();

  const createMutation = useMutation((mesociclo: Mesociclo) => mesociclosApi.postMesociclo(mesociclo), {
    onSuccess: (data) => {
      clearError();
      let _old = queryClient.getQueryData(["mesociclos", usuario.idUsuario]);
      if (_old) {
        queryClient.setQueryData<Mesociclo[]>(["mesociclos", usuario.idUsuario], (old) => {
          return plainToClass(Mesociclo, [...(old ? old : []), data]);
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
  });

  const onSaveMesociclo = () => {
    mesociclo.usuario = usuario;
    mesociclo.nivel = usuario.nivel;
    createMutation.mutate(mesociclo);
  };

  const onSaveSesionEdit = (sesion: Sesion) => {
    const _semana = semana.map((s) => (s.numSesion === sesion.numSesion ? sesion : s));
    setSemana(plainToClass(Sesion, _semana));
    setSesionEdit(null);
  };

  return usuario ? (
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
        {sesionEdit ? (
          <CloseButton
            colorScheme="gray"
            size="md"
            variant="ghost"
            onClick={() => setSesionEdit(null)}
          ></CloseButton>
        ) : (
          <Link href="/usuarios">
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
    </Flex>
  ) : (
    <Spinner />
  );
};

export default function NuevoMesocicloPage() {
  return (
    <Layout>
      <NuevoMesociclo />
    </Layout>
  );
}
