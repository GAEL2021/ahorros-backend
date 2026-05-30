import { ProgramacionesService } from './programaciones.service';
import { CreateProgramacionDto } from './dto/create-programacion.dto';
import { UpdateProgramacionDto } from './dto/update-programacion.dto';
import { Request } from 'express';
export declare class ProgramacionesController {
    private readonly programacionesService;
    constructor(programacionesService: ProgramacionesService);
    create(dto: CreateProgramacionDto, req: Request): Promise<{
        userId: string;
        carteraId: string;
        metaId: string;
        tipo: "fijo" | "porcentaje";
        monto?: number;
        porcentaje?: number;
        diaDelMes: number;
        activo: boolean;
        creadoEn: string;
        id: string;
    }>;
    getUserProgramaciones(req: Request): Promise<{
        userId: string;
        carteraId: string;
        metaId: string;
        tipo: "fijo" | "porcentaje";
        monto?: number;
        porcentaje?: number;
        diaDelMes: number;
        activo: boolean;
        creadoEn: string;
        id: string;
    }[]>;
    update(id: string, dto: UpdateProgramacionDto, req: Request): Promise<{
        id: string;
    }>;
    delete(id: string, req: Request): Promise<{
        message: string;
    }>;
    toggle(id: string, req: Request): Promise<{
        id: string;
        activo: boolean;
    }>;
}
