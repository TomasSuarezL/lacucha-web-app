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
