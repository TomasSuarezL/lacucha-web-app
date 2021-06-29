import { useQuery, useQueryClient } from "react-query";
import { plainToClass } from "class-transformer";
import { usuariosApi } from "../components/usuarios/Usuarios.api";
import { Mesociclo } from "../models/Mesociclo";
import { Sesion } from "../models/Sesion";

export const useMesociclos = (idUsuario: number) => {
  const queryClient = useQueryClient();

  const query = useQuery<Mesociclo[]>(
    ["mesociclos", idUsuario],
    () => usuariosApi.getMesociclos(idUsuario, false),
    {
      refetchOnWindowFocus: false,
      refetchInterval: 1000 * 60 * 15, // 15 min
      staleTime: 1000 * 60 * 60 * 15, // 15 min
    }
  );

  const updateMesociclo = (mesociclo: Mesociclo) => {
    queryClient.setQueryData<Mesociclo[]>(["mesociclos", idUsuario], (old) => {
      return plainToClass(
        Mesociclo,
        old.map((m) => (m.idMesociclo === mesociclo.idMesociclo ? mesociclo : m))
      );
    });
  };

  const updateSesion = (sesion: Sesion) => {
    queryClient.setQueryData<Mesociclo[]>(["mesociclos", idUsuario], (old) => {
      return plainToClass(
        Mesociclo,
        old.map((m) => ({
          ...m,
          sesiones: m.sesiones.map((s) => (s.idSesion === sesion.idSesion ? sesion : s)),
        }))
      );
    });
  };
  const deleteSesion = (idSesion: number) => {
    queryClient.setQueryData<Mesociclo[]>(["mesociclos", idUsuario], (old) => {
      return plainToClass(
        Mesociclo,
        old.map((m) => ({
          ...m,
          sesiones: m.sesiones.filter((s) => s.idSesion !== idSesion),
        }))
      );
    });
  };

  return { ...query, updateMesociclo, updateSesion, deleteSesion };
};
