import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { usuariosApi } from "../components/usuarios/Usuarios.api";
import { Usuario } from "../types/Usuario.type";
import { useError } from "./useError";

export const useUsuario: () => [Usuario, (usuario: Usuario) => void, (usuario: Usuario) => void] = () => {
  const router = useRouter();
  const { idUsuario } = router.query;
  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const { clearError, setError } = useError();

  // Get User: Look in cache, otherwise request.
  useEffect(() => {
    const loadUsuario = async () => {
      const queries = queryClient.getQueryCache().findAll(["usuarios"]);

      if (queries.length > 0) {
        const usuarios = queryClient.getQueryData<Usuario[] | Usuario>(queries[queries.length - 1]?.queryKey);
        const _usuario = Array.isArray(usuarios)
          ? usuarios?.filter((u) => u.uuid.toString() === idUsuario)[0]
          : usuarios;
        setUsuario(_usuario);
      } else {
        const _usuario = await queryClient.fetchQuery(["usuarios", idUsuario], () =>
          usuariosApi.getUsuario(idUsuario as string)
        );
        setUsuario(_usuario);
      }
    };

    idUsuario && loadUsuario();
  }, [idUsuario]);

  const updateUsuarioMutation = useMutation((usuario: Usuario) => usuariosApi.putUsuario(usuario), {
    onSuccess: (data) => {
      clearError();
      setUsuario(data);
      queryClient.invalidateQueries("usuarios");
    },
    onError: (err: AxiosError) => {
      console.error(err.response);
      setError({
        message: "Ocurrió un error al cancelar el mesociclo.",
        isError: true,
        showContent: true,
      });
    },
  });

  return [usuario, setUsuario, (usuario: Usuario) => updateUsuarioMutation.mutate(usuario)];
};
