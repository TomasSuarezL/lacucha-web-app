import "reflect-metadata";
import { plainToClass, Type } from "class-transformer";
import { Nivel, Usuario } from "./Usuario";
import { addWeeks, differenceInDays, differenceInWeeks, isAfter, parseISO } from "date-fns";
import { Ejercicio } from "./Ejercicio";
import { Sesion } from "./Sesion";
import { PatronesMovimiento } from "./PatronMovimiento";
import { Bloque } from "./Bloque";
import { ejerciciosApi } from "../apis/Ejercicio.api";
import { Plantilla } from "./Plantilla";

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
  esValido(): boolean {
    return (
      !!this.objetivo &&
      !!this.organizacion &&
      !!this.sesionesPorSemana &&
      !!this.semanasPorMesociclo &&
      !!this.principalTrenSuperior &&
      !!this.principalTrenInferior
    );
  }

  cancelar(): Mesociclo {
    this.estado = { idEstadoMesociclo: 3, descripcion: "Cancelado" };
    return this;
  }

  async generarSemana(): Promise<Sesion[]> {
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

  generarSemanaDesdePlantilla(plantilla: Plantilla): Sesion[] {
    let diffDays = differenceInDays(
      new Date(),
      new Date(plantilla.sesiones[0].sesion.fechaEmpezado)
    );

    const diffWeeks = isAfter(new Date(), new Date(plantilla.sesiones[0].sesion.fechaEmpezado))
      ? Math.ceil(diffDays / 7)
      : Math.floor(diffDays / 7);

    return plantilla.sesiones.map((s) =>
      plainToClass(Sesion, {
        ...s.sesion,
        fechaEmpezado: addWeeks(parseISO(s.sesion.fechaEmpezado.toString()), diffWeeks),
      })
    );
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
    console.log(mesociclo.getFechaInicio());
    let diffDays = differenceInDays(new Date(), mesociclo.getFechaInicio());
    const diffWeeks = isAfter(new Date(), mesociclo.getFechaInicio())
      ? Math.ceil(diffDays / 7)
      : Math.floor(diffDays / 7);

    console.log(diffDays, diffWeeks);

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
