export interface Usuario {
  uuid: string;
  idUsuario: number;
  nombre: string;
  apellido;
  email: string;
  username: string;
  imgUrl: string;
  altura: number;
  peso: number;
  genero: Genero;
  nivel: Nivel;
  fechaNacimiento: Date;
  actulizadoEn: Date;
  creadoEn: Date;
}

export interface Genero {
  idGenero: number;
  descripcion: string;
}

export interface Nivel {
  idNivel: number;
  descripcion: string;
}
