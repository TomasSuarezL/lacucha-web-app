import React, { useMemo } from "react";
import { Flex, Heading, Progress } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import nookies from "nookies";
import { usePlantillas } from "../../../hooks/usePlantillas";
import { PlantillaForm } from "../../../components/configuracion/plantillas/PlantillaForm";
import { plantillasApi } from "../../../apis/Plantillas.api";
import { GetServerSidePropsContext } from "next";
import { api } from "../../../services/api";
import { plainToClass } from "class-transformer";
import { Sesion } from "../../../models/Sesion";

interface PlantillaEditorProps {
  idPlantilla: string;
}

const PlantillaEditor = ({ idPlantilla }: PlantillaEditorProps) => {
  const router = useRouter();
  const { data: plantillas, isLoading, updatePlantillaMutation } = usePlantillas();

  const onClickSavePlantilla = (plantilla) => {
    plantilla.idPlantilla = idPlantilla;
    updatePlantillaMutation.mutate(plantilla);
  };

  const plantilla = useMemo(() => {
    const _plantilla = plantillas?.filter((p) => p.idPlantilla.toString() === idPlantilla)[0];
    return {
      ..._plantilla,
      sesiones: _plantilla.sesiones.map((s) => ({ ...s, sesion: plainToClass(Sesion, s.sesion) })),
    };
  }, [plantillas]);

  if (!isLoading && plantilla === undefined) {
    router.push("/configuracion/plantillas");
    return <div></div>;
  }

  return !isLoading ? (
    <Flex direction="column" m={[1, 6]} p={[3, 4, 6]} bg="white" boxShadow="lg">
      <Flex>
        <Heading as="h4" fontSize={["xl", "2xl"]} mb={[1, 2, 4]}>
          Editar Plantilla
        </Heading>
      </Flex>
      <PlantillaForm
        onSubmitForm={(plantilla) => onClickSavePlantilla(plantilla)}
        plantilla={plantilla}
        isLoading={updatePlantillaMutation.isLoading}
      />
    </Flex>
  ) : (
    <Progress position="absolute" top="0" left="0" width="100vw" size="xs" isIndeterminate />
  );
};

const PlantillaDetail = () => {
  const router = useRouter();
  const { idPlantilla } = router.query;
  return (
    <Flex direction="column" flex="1">
      <PlantillaEditor idPlantilla={idPlantilla.toString()} />
    </Flex>
  );
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    api.defaults.headers.common["Authorization"] = `Bearer ${cookies.token}`;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(["plantillas"], () => plantillasApi.getPlantillas());

    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (err) {
    ctx.res.writeHead(302, { Location: "/login" });
    ctx.res.end();

    return { props: {} as never };
  }
};

export default PlantillaDetail;
