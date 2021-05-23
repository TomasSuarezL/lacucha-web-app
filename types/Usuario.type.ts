import firebase from "firebase/app";

export interface Usuario {
  uuid: string;
  idUsuario: number;
  nombre: string;
  apellido: string;
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

export interface UserFirebase extends firebase.User {
  idToken: string;
}
export interface User extends UserFirebase, Usuario {
  type: "User";
}

export const Niveles: Nivel[] = [
  { idNivel: 1, descripcion: "Principiante" },
  { idNivel: 2, descripcion: "Intermedio" },
  { idNivel: 3, descripcion: "Avanzado" },
];
