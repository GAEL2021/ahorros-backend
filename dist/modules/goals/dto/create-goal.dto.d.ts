export declare class CreateGoalDto {
    nombre: string;
    montoObjetivo: number;
    fechaLimite: string;
    invitadosEmails?: string[];
    modoAporte?: 'manual' | 'automatico';
    carteraId?: string;
    programacionTipo?: 'fijo' | 'porcentaje';
    programacionMonto?: number;
    programacionPorcentaje?: number;
    programacionDia?: number;
}
