import React, { useMemo, useState } from "react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import nookies from "nookies";
import { Flex, Spinner, Stack } from "@chakra-ui/react";
import ConfiguracionLayout from "../../../components/configuracion/ConfiguracionLayout";
import { EjercicioModal } from "../../../components/configuracion/ejercicios/EjercicioModal";
import { EjerciciosControls } from "../../../components/configuracion/ejercicios/EjerciciosControls";
import { EjerciciosTable } from "../../../components/configuracion/ejercicios/EjerciciosTable";
import { useEjercicios } from "../../../hooks/useEjercicios";
import { Ejercicio, PatronesMovimiento } from "../../../models/Mesociclo";
import { api } from "../../../services/api";
import { ejerciciosApi } from "../../../components/mesociclos/Ejercicios.api";
import { GetServerSidePropsContext } from "next";

interface EjerciciosControls {
  search: string;
  patron: typeof PatronesMovimiento[number] | "Todos";
}

export default function ConfiguracionEjerciciosPage() {
  const [controls, setControls] = useState({ search: "", patron: "Todos" });
  const {
    data: ejercicios,
    isLoading,
    updateEjercicioMutation,
    createEjercicioMutation,
  } = useEjercicios();
  const [ejercicio, setEjercicio] = useState<Ejercicio | null>(null);

  const ejerciciosFiltered = useMemo(() => {
    return ejercicios?.filter(
      (e) =>
        (controls.patron === "Todos" || e.patron === controls.patron) &&
        e.nombre.toUpperCase().includes(controls.search.toUpperCase())
    );
  }, [ejercicios, controls]);

  return (
    <ConfiguracionLayout>
      <Stack direction="column" spacing={[2, 3]} p={[1, 2, 3]} w="full">
        {isLoading || updateEjercicioMutation.isLoading ? (
          <Flex w="full" justify="center">
            <Spinner />
          </Flex>
        ) : (
          <>
            <EjerciciosControls
              controls={controls}
              setControls={setControls}
              onSearchClick={() => {}}
              onCrearEjercicioClick={() => setEjercicio({} as Ejercicio)}
            />
            <EjerciciosTable
              ejercicios={ejerciciosFiltered}
              onClickEjercicio={(ejercicio: Ejercicio) => setEjercicio(ejercicio)}
            />
          </>
        )}
      </Stack>
      {ejercicio && (
        <EjercicioModal
          isOpen={!!ejercicio}
          onClose={() => setEjercicio(null)}
          onSave={(e) => {
            e.idEjercicio ? updateEjercicioMutation.mutate(e) : createEjercicioMutation.mutate(e);
            setEjercicio(null);
          }}
          ejercicioSelected={ejercicio}
        />
      )}
    </ConfiguracionLayout>
  );
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    api.defaults.headers.common["Authorization"] = `Bearer ${cookies.token}`;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery(["ejercicios"], () => ejerciciosApi.getEjercicios());

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
