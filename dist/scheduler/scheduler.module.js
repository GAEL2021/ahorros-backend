"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulerModule = void 0;
const common_1 = require("@nestjs/common");
const programaciones_scheduler_1 = require("./programaciones.scheduler");
const bancos_module_1 = require("../modules/bancos/bancos.module");
const goals_module_1 = require("../modules/goals/goals.module");
const programaciones_module_1 = require("../modules/programaciones/programaciones.module");
let SchedulerModule = class SchedulerModule {
};
exports.SchedulerModule = SchedulerModule;
exports.SchedulerModule = SchedulerModule = __decorate([
    (0, common_1.Module)({
        imports: [bancos_module_1.BancosModule, goals_module_1.GoalsModule, programaciones_module_1.ProgramacionesModule],
        providers: [programaciones_scheduler_1.ProgramacionesScheduler],
    })
], SchedulerModule);
//# sourceMappingURL=scheduler.module.js.map