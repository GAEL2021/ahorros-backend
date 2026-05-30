import { ConfigService } from '@nestjs/config';
import { FirebaseService } from '../../config/firebase/firebase.service';
import { EmailService } from '../../common/email/email.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';
import { DepositarDto } from './dto/depositar.dto';
import { RetirarDto } from './dto/retirar.dto';
import { FirebaseUser } from '../../common/guards/firebase-auth.guard';
export interface BancoDocument {
    uid: string;
    catalogoBancoId: string;
    nombre: string;
    color: string;
    saldo: number;
    descripcion: string;
    tipo: 'personal' | 'compartida';
    creadoPor: string;
    creadoEn: string;
    codigoCompartir: string;
}
export interface BancoMember {
    uid: string;
    email: string;
    saldoAportado: number;
    rol: 'creador' | 'invitado';
}
export interface TransaccionDocument {
    carteraId: string;
    userId: string;
    tipo: 'deposito' | 'retiro' | 'aporte_meta';
    monto: number;
    metaId?: string;
    descripcion: string;
    fecha: string;
}
export declare class BancosService {
    private readonly firebaseService;
    private readonly emailService;
    private readonly configService;
    constructor(firebaseService: FirebaseService, emailService: EmailService, configService: ConfigService);
    createBanco(dto: CreateBancoDto, user: FirebaseUser): Promise<{
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
    getUserBancos(user: FirebaseUser): Promise<(BancoDocument & {
        id: string;
    })[]>;
    getBancoById(bancoId: string, user: FirebaseUser): Promise<{
        miembros: (BancoMember & {
            id: string;
        })[];
        transacciones: (TransaccionDocument & {
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
    } | null>;
    updateBanco(bancoId: string, dto: UpdateBancoDto, user: FirebaseUser): Promise<{
        id: string;
    }>;
    deleteBanco(bancoId: string, user: FirebaseUser): Promise<{
        message: string;
    }>;
    joinBancoByCode(codigo: string, user: FirebaseUser): Promise<{
        id: string;
        nombre: string;
    }>;
    depositar(bancoId: string, dto: DepositarDto, user: FirebaseUser): Promise<{
        saldoAnterior: number;
        nuevoSaldo: number;
        monto: number;
    }>;
    retirar(bancoId: string, dto: RetirarDto, user: FirebaseUser): Promise<{
        saldoAnterior: number;
        nuevoSaldo: number;
        monto: number;
    }>;
    deducirDeCartera(bancoId: string, monto: number, metaId: string, user: FirebaseUser): Promise<{
        saldoAnterior: number;
        nuevoSaldo: number;
    }>;
    private assertMember;
    private getBancoMemberEmails;
    private deleteSubcollection;
}
