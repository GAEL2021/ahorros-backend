import { CatalogoBancosService } from './catalogo-bancos.service';
import { CreateCatalogoBancoDto } from './dto/create-catalogo-banco.dto';
import { UpdateCatalogoBancoDto } from './dto/update-catalogo-banco.dto';
export declare class CatalogoBancosController {
    private readonly catalogoBancosService;
    constructor(catalogoBancosService: CatalogoBancosService);
    getAll(): Promise<{
        nombre: string;
        color: string;
        icono: string;
        creadoEn: string;
        id: string;
    }[]>;
    getPublicos(): Promise<{
        id: string;
        nombre: string;
    }[]>;
    create(dto: CreateCatalogoBancoDto): Promise<{
        nombre: string;
        color: string;
        icono: string;
        creadoEn: string;
        id: string;
    }>;
    update(id: string, dto: UpdateCatalogoBancoDto): Promise<{
        id: string;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
