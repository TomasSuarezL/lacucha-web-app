import { useQuery, useQueryClient } from "react-query";
import { plainToClass } from "class-transformer";
import { usuariosApi } from "../components/usuarios/Usuarios.api";
import { Mesociclo, Sesion } from "../models/Mesociclo";

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

  return { ...query, updateSesion };
};
