import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { ejerciciosApi } from "../apis/Ejercicio.api";
import { Ejercicio } from "../models/Ejercicio";
import { useError } from "./useError";

export const useEjercicios = () => {
  const queryClient = useQueryClient();
  const { setError, clearError } = useError();

  const data = useQuery<Ejercicio[]>(["ejercicios"], () => ejerciciosApi.getEjercicios(), {
    refetchOnWindowFocus: false,
    refetchInterval: 1000 * 60 * 15, // 15 min
    staleTime: 1000 * 60 * 60 * 15, // 15 min
  });

  const updateEjercicioMutation = useMutation(
    (ejercicio: Ejercicio) => ejerciciosApi.putEjercicio(ejercicio),
    {
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "No se pudo actualizar el ejercicio.",
          isError: true,
          showContent: true,
        });
      },
      onSuccess: (data, variables, context) => {
        clearError();
        queryClient.setQueryData<Ejercicio[]>(["ejercicios"], (old) => {
          return old.map((e) => (e.idEjercicio === data.idEjercicio ? data : e));
        });
      },
    }
  );

  const createEjercicioMutation = useMutation(
    (ejercicio: Ejercicio) => ejerciciosApi.postEjercicio(ejercicio),
    {
      onError: (err: AxiosError) => {
        console.error(err.response);
        setError({
          message: "No se pudo crear el ejercicio.",
          isError: true,
          showContent: true,
        });
      },
      onSuccess: (data, variables, context) => {
        clearError();
        queryClient.setQueryData<Ejercicio[]>(["ejercicios"], (old) => {
          return [...old, data];
        });
      },
    }
  );

  return { ...data, updateEjercicioMutation, createEjercicioMutation };
};
