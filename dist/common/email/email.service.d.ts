import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendInviteToWallet(toEmail: string, inviterName: string, walletName: string, codigoCompartir: string, appUrl: string): Promise<any>;
    sendInviteToGoal(toEmail: string, inviterName: string, goalName: string, codigoCompartir: string, appUrl: string): Promise<any>;
    notifyGoalContribution(emails: string[], excludeEmail: string, contributorName: string, goalName: string, monto: number, nuevoAcumulado: number, montoObjetivo: number): Promise<void>;
    notifyGoalUpdated(emails: string[], excludeEmail: string, editorName: string, goalName: string, cambios: string[]): Promise<void>;
    notifyGoalMemberJoined(emails: string[], excludeEmail: string, newMemberName: string, goalName: string): Promise<void>;
    notifyWalletDeposit(emails: string[], excludeEmail: string, depositorName: string, walletName: string, monto: number, nuevoSaldo: number): Promise<void>;
    notifyWalletWithdraw(emails: string[], excludeEmail: string, withdrawerName: string, walletName: string, monto: number, nuevoSaldo: number): Promise<void>;
    notifyWalletMemberJoined(emails: string[], excludeEmail: string, newMemberName: string, walletName: string): Promise<void>;
    private cardTemplate;
    private sendMail;
}
