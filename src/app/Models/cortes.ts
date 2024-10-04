export interface Cortes {
    Id: number,
    IdEmpleado: number,
    NombreApellidoEmpleado: string,
    IdServicio: number,
    CodServicio: string,
    DescServicio: string,
    IdFormaPago: number,
    CodigoFormaPago: string,
    DescripcionFormaPago: string,
    Fecha: Date,
    Duracion: string,
    Comentario: string,
    PrecioNeto: number,
    CreateAt: Date,
    CreateBy: string,
    UpdateAt: Date,
    UpdateBy: string
}

export interface CortesResponse {
    filterInfo: FilterInfo
    data: Cortes[]
}

export interface FilterInfo {
    totalRecords: number
    Records: number
    page: number
    pageSize: number
}

export interface AddCorte {
    IdEmpleado: number,
    IdServicio: number,
    IdFormaPago: number,
    Fecha: Date,
    Duracion: string,
    Comentario: string,
    PrecioNeto: number,
    CreateAt: Date,
    CreateBy: string,
    UpdateAt: Date,
    UpdateBy: string,
}

export interface CortesAttributes {
    Id?: number,
    IdEmpleado: number,
    IdServicio: number,
    IdFormaPago: number,
    Fecha: Date,
    Duracion: string,
    Comentario: string,
    PrecioNeto: number,
    CreateAt: Date,
    CreateBy: string,
    UpdateAt: Date,
    UpdateBy: string,
}

