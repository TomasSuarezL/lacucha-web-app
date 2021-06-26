import { Nivel } from "./Usuario";
import { Objetivo, Organizacion } from "./Mesociclo";
import { Sesion } from "./Sesion";

export class Plantilla {
  idPlantilla: number;
  nombre: string;
  sesiones: SesionXPlantilla[];
  nivel: Nivel;
  objetivo: Objetivo;
  organizacion: Organizacion;
  sesionesPorSemana: number;
  creadoEn: Date;
  actualizadoEn: Date;
}

export class SesionXPlantilla {
  idSesionXPlantilla?: number;
  idPlantilla?: number;
  sesion: Sesion;
}
