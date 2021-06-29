import React, { useState } from "react";
import { GetServerSidePropsContext } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import nookies from "nookies";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import ConfiguracionLayout from "../../../components/configuracion/ConfiguracionLayout";
import { api } from "../../../services/api";
import { plantillasApi } from "../../../apis/Plantillas.api";
import { usePlantillas } from "../../../hooks/usePlantillas";
import { PlantillasTable } from "../../../components/configuracion/plantillas/PlantillasTable";
import { Plantilla } from "../../../models/Plantilla";
import { AiOutlinePlus } from "react-icons/ai";
import { useError } from "../../../hooks/useError";
import { useRouter } from "next/router";
import { DeleteButton } from "../../../components/shared/Buttons";

const PlantillasControls = () => {
  const router = useRouter();
  return (
    <Button onClick={() => router.push("/configuracion/plantillas/nuevaPlantilla")}>
      <AiOutlinePlus />
      <Text ml={[1, 2]}>Nueva Plantilla</Text>
    </Button>
  );
};

export default function ConfiguracionPlantillasPage() {
  const router = useRouter();
  const cancelRef = React.useRef();
  const { setError } = useError();
  const { data: plantillas, isLoading, error, isError, deletePlantillaMutation } = usePlantillas();
  const [plantilla, setPlantilla] = useState<Plantilla | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const onClickDeletePlantilla = (plantilla: Plantilla) => {
    setPlantilla(plantilla);
    setIsAlertOpen(true);
  };

  if (isError) {
    setError({
      message: "No se pudieron obtener las plantillas.",
      isError: true,
      showContent: false,
    });
    return (
      <ConfiguracionLayout>
        <div></div>
      </ConfiguracionLayout>
    );
  }

  console.log(plantillas);

  return (
    <ConfiguracionLayout>
      <Stack direction="column" spacing={[2, 3]} p={[1, 2, 3]} w="full">
        {isLoading || deletePlantillaMutation.isLoading ? (
          <Flex w="full" justify="center">
            <Spinner />
          </Flex>
        ) : (
          <>
            <PlantillasControls />
            <PlantillasTable
              plantillas={plantillas}
              onClickPlantilla={(plantilla) =>
                router.push(`/configuracion/plantillas/${plantilla.idPlantilla}`)
              }
              onClickDeletePlantilla={(plantilla) => onClickDeletePlantilla(plantilla)}
            />
          </>
        )}
      </Stack>
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar Plantilla
            </AlertDialogHeader>

            <AlertDialogBody>
              Está seguro que desea eliminar la plantilla seleccionada?
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
              <DeleteButton
                onClick={() => {
                  setIsAlertOpen(false);
                  deletePlantillaMutation.mutate(plantilla);
                }}
                ml={3}
              >
                Eliminar
              </DeleteButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </ConfiguracionLayout>
  );
}

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
    // either the `token` cookie didn't exist
    // or token verification failed
    // either way: redirect to the login page
    ctx.res.writeHead(302, { Location: "/login" });
    ctx.res.end();

    // `as never` prevents inference issues
    // with InferGetServerSidePropsType.
    // The props returned here don't matter because we've
    // already redirected the user.
    return { props: {} as never };
  }
};
