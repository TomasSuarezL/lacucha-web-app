import "reflect-metadata";
import { plainToClass, Type } from "class-transformer";
import { Nivel, Usuario } from "../types/Usuario.type";
import { immerable } from "immer";
import { ejerciciosApi } from "../components/mesociclos/Ejercicios.api";
import { addWeeks, differenceInWeeks, parseISO } from "date-fns";

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
  getFechaInicio(): Date {
    return new Date(this.sesiones[0].fechaEmpezado);
  }
  estaFinalizado(): boolean {
    return this.estado.idEstadoMesociclo === 2;
  }
  estaActivo(): boolean {
    return this.estado.idEstadoMesociclo === 1;
  }

  // /* DELTE THIS METHOD FOR INIT FOR TESTING */
  // async initMesociclo() {
  //   this.organizacion = Organizaciones[0];
  //   this.objetivo = Objetivos[0];
  //   this.principalTrenInferior = {
  //     idEjercicio: 1,
  //     nombre: "Traditional Push-ups",
  //     patron: "Empuje",
  //     urlVideo: "",
  //   };
  //   this.principalTrenSuperior = {
  //     idEjercicio: 1,
  //     nombre: "Traditional Push-ups",
  //     patron: "Empuje",
  //     urlVideo: "",
  //   };
  //   this.semanasPorMesociclo = 2;
  //   this.sesionesPorSemana = 2;

  //   this.sesiones = await this.generarSesiones();
  // }

  cancelar(): Mesociclo {
    this.estado = { idEstadoMesociclo: 3, descripcion: "Cancelado" };
    return this;
  }

  async generarSemana() {
    // loop over number of sesiones por semana
    // for each sesion, create 3 bloques with random ejercicios
    let _ejercicios = await ejerciciosApi.getEjercicios(PatronesMovimiento.join(","));
    let _trenSuperior = _ejercicios.filter((e) =>
      ["Empuje", "Tracción"].includes(e.patron as string)
    );
    let _trenInferior = _ejercicios.filter((e) =>
      ["Rodilla", "Cadera"].includes(e.patron as string)
    );
    let _core = _ejercicios.filter((e) => ["Core"].includes(e.patron as string));

    this.sesiones = [];

    let _sesionesSemana = Array.from({ length: this.sesionesPorSemana }, (_v, idx) => {
      let _sesion = new Sesion();

      let offset = Math.round((7 / this.sesionesPorSemana) * idx);
      _sesion.fechaEmpezado.setDate(new Date().getDate() + offset);
      _sesion.numSesion = idx + 1;

      let _bloques = Array.from({ length: 3 }, (_b, idxb) => {
        let _bloque: Bloque = {
          numBloque: idxb + 1,
          series: 3,
          ejercicios: [
            {
              numEjercicio: 1,
              carga: 10,
              repeticiones: 8,
              ejercicio: _trenSuperior[Math.floor(Math.random() * _trenSuperior.length)],
            },
            {
              numEjercicio: 2,
              carga: 10,
              repeticiones: 8,
              ejercicio: _trenInferior[Math.floor(Math.random() * _trenInferior.length)],
            },
            {
              numEjercicio: 3,
              carga: 10,
              repeticiones: 8,
              ejercicio: _core[Math.floor(Math.random() * _core.length)],
            },
          ],
          creadoEn: new Date(),
        };
        return _bloque;
      });
      _sesion.bloques = _bloques;
      return _sesion;
    });
    return _sesionesSemana;
  }

  generarSesiones(semana: Sesion[]) {
    let _sesiones = Array.from({ length: this.semanasPorMesociclo }, (s, idx) => {
      let _semana = semana.map((s) => {
        let _sesion = new Sesion();
        _sesion.fechaEmpezado = new Date(s.fechaEmpezado);
        _sesion.shiftDate(7 * idx);
        _sesion.numSesion = s.numSesion + idx * this.sesionesPorSemana;
        _sesion.bloques = [...s.bloques];
        return _sesion;
      });
      return _semana;
    });

    return _sesiones.flat();
  }

  static copiarDe(mesociclo: Mesociclo) {
    let diffWeeks = differenceInWeeks(new Date(), mesociclo.getFechaInicio());
    let _mesociclo = { ...mesociclo };
    _mesociclo.sesiones = mesociclo.sesiones.map((s) => {
      return plainToClass(Sesion, {
        ...s,
        fechaFinalizado: null,
        fechaEmpezado: addWeeks(parseISO(s.fechaEmpezado.toString()), diffWeeks),
      });
    });
    return plainToClass(Mesociclo, _mesociclo);
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

export const Objetivos: Objetivo[] = [
  { idObjetivo: 1, descripcion: "Acondicionamiento General" },
  { idObjetivo: 2, descripcion: "Hipertrofia" },
  { idObjetivo: 3, descripcion: "Fuerza" },
];

export interface Organizacion {
  idOrganizacion: number;
  descripcion: string;
}

export const Organizaciones: Organizacion[] = [
  { idOrganizacion: 1, descripcion: "Full Body" },
  { idOrganizacion: 2, descripcion: "Tren Superior / Tren Inferior" },
  { idOrganizacion: 3, descripcion: "Combinado" },
];
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
  patron: string | PatronMovimiento;
  urlVideo: string;
  pesoInicial: number;
  esTemporal: boolean;
}

export interface PatronMovimiento {
  idPatron: number;
  descripcion: string;
}

export const PatronesMovimiento = <const>["Empuje", "Tracción", "Rodilla", "Cadera", "Core"];

export const PatronesMovimientoMap = {
  Empuje: { idPatron: 1, descripcion: "Empuje" },
  Tracción: { idPatron: 5, descripcion: "Tracción" },
  Rodilla: { idPatron: 2, descripcion: "Rodilla" },
  Cadera: { idPatron: 4, descripcion: "Cadera" },
  Core: { idPatron: 3, descripcion: "Core" },
};
