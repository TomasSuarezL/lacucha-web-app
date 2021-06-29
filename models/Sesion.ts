import { immerable } from "immer";
import { Bloque } from "./Bloque";

export class Sesion {
  [immerable] = true;

  idSesion: number;
  idMesociclo: number;
  numSesion: number;
  bloques: Bloque[];
  fechaEmpezado: Date;
  fechaFinalizado?: Date;
  creadoEn: Date;
  actualizadoEn?: Date;

  constructor(numSesion?: number, idMesociclo?: number) {
    this.idMesociclo = idMesociclo;
    this.numSesion = numSesion;
    this.bloques = [];
    this.creadoEn = new Date();
    let _fechaEmpezado = new Date();
    _fechaEmpezado.setUTCHours(12);
    this.fechaEmpezado = _fechaEmpezado;
  }

  estaFinalizada(): boolean {
    return !!this.fechaFinalizado;
  }

  finalizar(): void {
    this.fechaFinalizado = new Date();
  }

  shiftDate(offset: number) {
    this.fechaEmpezado.setDate(this.fechaEmpezado.getDate() + offset);
  }
}
