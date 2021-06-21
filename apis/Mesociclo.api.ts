import { plainToClass } from "class-transformer";
import { Mesociclo } from "../models/Mesociclo";
import { api } from "../services/api";

export const mesociclosApi = {
  postMesociclo: async (mesociclo: Mesociclo) => {
    const { data } = await api.post<Mesociclo>(`/mesociclos`, mesociclo);
    return plainToClass(Mesociclo, data);
  },
  putMesociclo: async (mesociclo: Mesociclo) => {
    const { data } = await api.put<Mesociclo>(`/mesociclos/${mesociclo.idMesociclo}`, mesociclo);
    return plainToClass(Mesociclo, data);
  },
};
