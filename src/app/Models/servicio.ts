export interface Servicio {
    id: number
    CodServicio: string
    DescServicio: string
    PrecioNeto: number
}

export interface ServicioCreationAttributes extends Omit<Servicio, 'id'> {
    id?: number;
}