import { plainToClass } from "class-transformer";
import { Mesociclo } from "../../models/Mesociclo";
import { api } from "../../services/api";
import { Usuario } from "../../types/Usuario.type";

export const usuariosApi = {
  getUsuario: (uid: String) => api.get(`/usuarios/${uid}`),
  getUsuarios: async (search: String) => {
    const { data } = await api.get<Usuario[]>(`/usuarios?search=${search}`);
    return data;
  },
  getMesociclos: async (id: number, activo: boolean) => {
    const { data } = await api.get(`/usuarios/${id}/mesociclos?activo=${activo}`);
    return plainToClass(Mesociclo, data);
  },
};
