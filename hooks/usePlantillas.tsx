import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { plantillasApi } from "../apis/Plantillas.api";
import { Plantilla } from "../models/Plantilla";
import { useError } from "./useError";

export const usePlantillas = () => {
  const queryClient = useQueryClient();
  const { setError, clearError } = useError();

  const data = useQuery<Plantilla[]>(["plantillas"], async () => plantillasApi.getPlantillas(), {
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15, // 15 min
    staleTime: 1000 * 60 * 60 * 15, // 15 min
  });

  const updatePlantillaMutation = useMutation(
    (plantilla: Plantilla) => plantillasApi.putPlantilla(plantilla),
    {
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "No se pudo actualizar la plantilla.",
          isError: true,
          showContent: true,
        });
      },
      onSuccess: (data, variables, context) => {
        clearError();
        queryClient.setQueryData<Plantilla[]>(["plantillas"], (old) => {
          return old.map((e) => (e.idPlantilla === data.idPlantilla ? data : e));
        });
      },
    }
  );

  const createPlantillaMutation = useMutation(
    (plantilla: Plantilla) => plantillasApi.postPlantilla(plantilla),
    {
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "No se pudo crear la plantilla.",
          isError: true,
          showContent: true,
        });
      },
      onSuccess: (data, variables, context) => {
        clearError();
        queryClient.setQueryData<Plantilla[]>(["plantillas"], (old) => {
          return [...old, data];
        });
      },
    }
  );

  const deletePlantillaMutation = useMutation(
    (plantilla: Plantilla) => plantillasApi.deletePlantilla(plantilla),
    {
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "No se pudo eliminar la plantilla.",
          isError: true,
          showContent: true,
        });
      },
      onSuccess: (data, variables, context) => {
        clearError();
        queryClient.setQueryData<Plantilla[]>(["plantillas"], (old) => {
          return old.filter((p) => p.idPlantilla !== variables.idPlantilla);
        });
      },
    }
  );

  return { ...data, updatePlantillaMutation, createPlantillaMutation, deletePlantillaMutation };
};
