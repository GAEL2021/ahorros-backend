"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const firebase_module_1 = require("./config/firebase/firebase.module");
const email_module_1 = require("./common/email/email.module");
const goals_module_1 = require("./modules/goals/goals.module");
const bancos_module_1 = require("./modules/bancos/bancos.module");
const programaciones_module_1 = require("./modules/programaciones/programaciones.module");
const catalogo_bancos_module_1 = require("./modules/catalogo-bancos/catalogo-bancos.module");
const admin_module_1 = require("./modules/admin/admin.module");
const scheduler_module_1 = require("./scheduler/scheduler.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            firebase_module_1.FirebaseModule,
            email_module_1.EmailModule,
            goals_module_1.GoalsModule,
            bancos_module_1.BancosModule,
            programaciones_module_1.ProgramacionesModule,
            catalogo_bancos_module_1.CatalogoBancosModule,
            admin_module_1.AdminModule,
            scheduler_module_1.SchedulerModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map