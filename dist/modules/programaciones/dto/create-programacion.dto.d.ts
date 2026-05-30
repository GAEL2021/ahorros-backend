export declare class CreateProgramacionDto {
    carteraId: string;
    metaId: string;
    tipo: 'fijo' | 'porcentaje';
    monto?: number;
    porcentaje?: number;
    diaDelMes: number;
    activo?: boolean;
}
