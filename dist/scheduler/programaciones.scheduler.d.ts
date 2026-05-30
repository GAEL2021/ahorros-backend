import { FirebaseService } from '../config/firebase/firebase.service';
import { ProgramacionesService } from '../modules/programaciones/programaciones.service';
import { BancosService } from '../modules/bancos/bancos.service';
import { GoalsService } from '../modules/goals/goals.service';
export declare class ProgramacionesScheduler {
    private readonly firebaseService;
    private readonly programacionesService;
    private readonly bancosService;
    private readonly goalsService;
    private readonly logger;
    constructor(firebaseService: FirebaseService, programacionesService: ProgramacionesService, bancosService: BancosService, goalsService: GoalsService);
    ejecutarProgramacionesDiarias(): Promise<void>;
    private ejecutarProgramacion;
}
