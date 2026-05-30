"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramacionesModule = void 0;
const common_1 = require("@nestjs/common");
const programaciones_controller_1 = require("./programaciones.controller");
const programaciones_service_1 = require("./programaciones.service");
const bancos_module_1 = require("../bancos/bancos.module");
let ProgramacionesModule = class ProgramacionesModule {
};
exports.ProgramacionesModule = ProgramacionesModule;
exports.ProgramacionesModule = ProgramacionesModule = __decorate([
    (0, common_1.Module)({
        imports: [bancos_module_1.BancosModule],
        controllers: [programaciones_controller_1.ProgramacionesController],
        providers: [programaciones_service_1.ProgramacionesService],
        exports: [programaciones_service_1.ProgramacionesService],
    })
], ProgramacionesModule);
//# sourceMappingURL=programaciones.module.js.map