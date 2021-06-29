import { Plantilla } from "../models/Plantilla";
import { api } from "../services/api";

export const plantillasApi = {
  getPlantillas: async () => {
    const { data } = await api.get<Plantilla[]>(`/plantillas`);
    return data;
  },
  putPlantilla: async (plantilla: Plantilla) => {
    const { data } = await api.put<Plantilla>(`/plantillas`, plantilla);
    return data;
  },
  postPlantilla: async (plantilla: Plantilla) => {
    const { data } = await api.post<Plantilla>(`/plantillas`, plantilla);
    return data;
  },
  deletePlantilla: async (plantilla: Plantilla) => {
    const { data } = await api.delete<Plantilla>(`/plantillas/${plantilla.idPlantilla}`);
    return data;
  },
};
