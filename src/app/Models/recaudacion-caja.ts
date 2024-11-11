export interface RecaudacionCaja {
    filterInfo: FilterInfo
    data: RecaudacionCajaData[]
}

export interface FilterInfo {
    Records: number
    desde: string
    hasta: string
}

export interface RecaudacionCajaData {
    Fecha: string
    CodigoFormaPago: string
    DescripcionFormaPago: string
    Total: string
}