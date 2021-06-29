import { Ejercicio } from "./Ejercicio";

export interface Bloque {
  idBloque?: number;
  numBloque: number;
  series: number;
  ejercicios: EjerciciosXBloque[];
  creadoEn: Date;
}

export interface EjerciciosXBloque {
  idEjerciciosxbloque?: number;
  numEjercicio: number;
  repeticiones: number;
  carga: number;
  ejercicio: Ejercicio;
}
