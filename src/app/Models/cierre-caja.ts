export interface cierreCaja {
    desde: Date
    hasta: Date
    dias: Dia[]
    totalPeriodo: TotalPeriodo
    totalPeriodoJefe: TotalPeriodoJefe
}

export interface Dia {
    dia: Date
    empleados: Empleado[]
    totalDia: TotalDia
    totalDiaJefe: TotalDiaJefe
}

export interface Empleado {
    nombreApellido: string
    lineasDia: LineasDum[]
    totalesEmpleado: TotalesEmpleado
}

export interface LineasDum {
    nombreApellido: string
    descServicio: string
    precioNeto: string
    descFormaPago: string
    fecha: Date
    comentario: string
    montoACobrar: number
    nroCorte: number
}

export interface TotalesEmpleado {
    CantCortes: number
    PrecioNeto: number
    MontoCobrar: number
}

export interface TotalDia {
    CantCortes: number
    PrecioNeto: number
    MontoCobrar: number
}

export interface TotalDiaJefe {
    CantCortes: number
    PrecioNeto: number
    MontoCobrar: number
}

export interface TotalPeriodo {
    CantCortes: number
    PrecioNeto: number
    MontoCobrar: number
}

export interface TotalPeriodoJefe {
    CantCortes: number
    PrecioNeto: number
    MontoCobrar: number
}