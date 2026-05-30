import { BancosService } from './bancos.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { DepositarDto } from './dto/depositar.dto';
import { RetirarDto } from './dto/retirar.dto';
import { Request } from 'express';
export declare class BancosController {
    private readonly bancosService;
    constructor(bancosService: BancosService);
    create(dto: CreateBancoDto, req: Request): Promise<{
        uid: string;
        catalogoBancoId: string;
        nombre: string;
        color: string;
        saldo: number;
        descripcion: string;
        tipo: "personal" | "compartida";
        creadoPor: string;
        creadoEn: string;
        codigoCompartir: string;
        id: string;
    }>;
    getUserBancos(req: Request): Promise<(import("./bancos.service").BancoDocument & {
        id: string;
    })[]>;
    joinByCode(codigo: string, req: Request): Promise<{
        id: string;
        nombre: string;
    }>;
    getBancoById(id: string, req: Request): Promise<{
        miembros: (import("./bancos.service").BancoMember & {
            id: string;
        })[];
        transacciones: (import("./bancos.service").TransaccionDocument & {
            id: string;
        })[];
        uid: string;
        catalogoBancoId: string;
        nombre: string;
        color: string;
        saldo: number;
        descripcion: string;
        tipo: "personal" | "compartida";
        creadoPor: string;
        creadoEn: string;
        codigoCompartir: string;
        id: string;
    }>;
    updateBanco(id: string, dto: UpdateBancoDto, req: Request): Promise<{
        id: string;
    }>;
    deleteBanco(id: string, req: Request): Promise<{
        message: string;
    }>;
    depositar(id: string, dto: DepositarDto, req: Request): Promise<{
        saldoAnterior: number;
        nuevoSaldo: number;
        monto: number;
    }>;
    retirar(id: string, dto: RetirarDto, req: Request): Promise<{
        saldoAnterior: number;
        nuevoSaldo: number;
        monto: number;
    }>;
}
