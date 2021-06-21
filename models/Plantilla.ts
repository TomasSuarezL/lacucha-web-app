import { Nivel } from "./Usuario";
import { Objetivo, Organizacion } from "./Mesociclo";
import { Sesion } from "./Sesion";

export class Plantilla {
  idPlantilla: number;
  sesiones: Sesion[];
  nivel: Nivel;
  objetivo: Objetivo;
  organizacion: Organizacion;
  sesionesPorSemana: number;
  creadoEn: Date;
  actualizadoEn: Date;
}
