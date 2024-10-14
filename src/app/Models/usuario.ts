import { Rol } from "./rol"

export interface Usuario {
    Id: number
    Nombre: string
    Apellido: string
    Alias: string
    DNI: number
    Email: string
    Password: string
    FechaCreacion: string
    IdRol: number
}

export interface Login {
    Nombre: string
    Apellido: string
    Alias: string
    DNI: number
    Email: string
    Rol: Rol
}