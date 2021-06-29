import { plainToClass } from "class-transformer";
import { Sesion } from "../models/Sesion";
import { api } from "../services/api";

export const sesionesApi = {
  putSesion: async (sesion: Sesion) => {
    const { data } = await api.put<Sesion>(`/sesiones/${sesion.idSesion}`, sesion);
    return plainToClass(Sesion, data);
  },
  postSesion: async (sesion: Sesion) => {
    const { data } = await api.post<Sesion>(`/sesiones`, sesion);
    return plainToClass(Sesion, data);
  },
  deleteSesion: async (idSesion: number) => {
    const { data } = await api.delete<Boolean>(`/sesiones/${idSesion}`);
    return data;
  },
};
