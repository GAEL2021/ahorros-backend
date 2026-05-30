export declare class CreateBancoDto {
    catalogoBancoId: string;
    saldoInicial?: number;
    descripcion?: string;
    tipo?: 'personal' | 'compartida';
    invitadosEmails?: string[];
}
