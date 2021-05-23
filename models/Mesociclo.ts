import "reflect-metadata";
import { Type } from "class-transformer";
import { Nivel, Usuario } from "../types/Usuario.type";
import { immerable } from "immer";

export class Mesociclo {
  idMesociclo: number;
  usuario: Usuario;
  nivel: Nivel;
  estado: EstadoMesociclo;
  objetivo: Objetivo;
  organizacion: Organizacion;
  principalTrenSuperior: Ejercicio;
  principalTrenInferior: Ejercicio;
  semanasPorMesociclo: number;
  sesionesPorSemana: number;

  @Type(() => Sesion)
  sesiones: Sesion[];

  fechaFinReal: Date;
  aumentoMotivacion?: boolean;
  masCercaObjetivos?: boolean;
  sentimiento?: number;
  durmiendo?: number;
  alimentado?: number;
  creadoEn?: Date;
  actualizadoEn: Date;

  getFechaFinalizacion(): Date {
    return new Date(this.sesiones[this.sesiones.length - 1].fechaEmpezado);
  }
  estaFinalizado(): boolean {
    return this.estado.idEstadoMesociclo === 2;
  }
}

export interface EstadoMesociclo {
  idEstadoMesociclo: number;
  descripcion: string;
}
export interface Objetivo {
  idObjetivo: number;
  descripcion: string;
}
export interface Organizacion {
  idOrganizacion: number;
  descripcion: string;
}

export class Sesion {
  [immerable] = true;

  idSesion: number;
  bloques: Bloque[];
  fechaEmpezado: Date;
  fechaFinalizado?: Date;
  creadoEn: Date;
  actualizadoEn?: Date;

  constructor() {
    this.bloques = [];
    this.creadoEn = new Date();
  }

  estaFinalizada(): boolean {
    return !!this.fechaFinalizado;
  }

  finalizar(): void {
    this.fechaFinalizado = new Date();
  }
}

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

export interface Ejercicio {
  idEjercicio: number;
  nombre: string;
  patron: string;
  urlVideo: string;
}
