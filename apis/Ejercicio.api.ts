import { Ejercicio } from "../models/Ejercicio";
import { api } from "../services/api";

export const ejerciciosApi = {
  getEjercicios: async (patrones?: string) => {
    const { data } = await api.get<Ejercicio[]>(
      `/ejercicios?${patrones ? `patrones=${patrones}` : ""}`
    );
    return data;
  },
  putEjercicio: async (ejercicio: Ejercicio) => {
    const { data } = await api.put<Ejercicio>(`/ejercicios/${ejercicio.idEjercicio}`, ejercicio);
    return data;
  },
  postEjercicio: async (ejercicio: Ejercicio) => {
    const { data } = await api.post<Ejercicio>(`/ejercicios`, ejercicio);
    return data;
  },
};
