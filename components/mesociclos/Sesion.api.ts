import { plainToClass } from "class-transformer";
import { Sesion } from "../../models/Mesociclo";
import { api } from "../../services/api";

export const sesionesApi = {
  putSesion: async (sesion: Sesion) => {
    const { data } = await api.put<Sesion>(`/sesiones/${sesion.idSesion}`, sesion);
    return plainToClass(Sesion, data);
  },
  postSesion: async (sesion: Sesion) => {
    const { data } = await api.post<Sesion>(`/sesiones`, sesion);
    return plainToClass(Sesion, data);
  },
};
