import { PatronMovimiento } from "./PatronMovimiento";

export interface Ejercicio {
  idEjercicio: number;
  nombre: string;
  patron: string | PatronMovimiento;
  urlVideo: string;
  pesoInicial: number;
  esTemporal: boolean;
}
