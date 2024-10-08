export default function formatTime(duracion: string): string {
    // Si el valor está vacío o es null, devolver 00:00
    if (!duracion) {
        return '00:00';
    }

    // Validar si el formato es HH:mm
    const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!regex.test(duracion)) {
        return '00:00';
    }

    // Si el formato es correcto, devolverlo directamente
    return duracion;
}