import { plainToClass } from "class-transformer";
import { Mesociclo } from "../../models/Mesociclo";
import { api } from "../../services/api";
import { Usuario } from "../../models/Usuario";

export const usuariosApi = {
  getUsuario: async (uid: string) => {
    const { data } = await api.get(`/usuarios/${uid}`);
    return data;
  },
  putUsuario: async (usuario: Usuario) => {
    const { data } = await api.put(`/usuarios/${usuario.uuid}`, usuario);
    return data;
  },
  getUsuarios: async (search: string) => {
    const { data } = await api.get<Usuario[]>(`/usuarios?search=${search}`);
    return data;
  },
  getMesociclos: async (id: number, activo: boolean) => {
    const { data } = await api.get<Mesociclo[]>(`/usuarios/${id}/mesociclos?activo=${activo}`);
    return plainToClass(Mesociclo, data);
  },
};
