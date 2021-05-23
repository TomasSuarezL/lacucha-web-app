import { Ejercicio } from "../../models/Mesociclo";
import { api } from "../../services/api";

export const ejerciciosApi = {
  getEjercicios: async (patrones: string) => {
    const { data } = await api.get<Ejercicio>(`/ejercicios?patrones=${patrones}`);
    return data;
  },
};
