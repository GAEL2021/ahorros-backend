"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramacionesController = void 0;
const common_1 = require("@nestjs/common");
const programaciones_service_1 = require("./programaciones.service");
const create_programacion_dto_1 = require("./dto/create-programacion.dto");
const update_programacion_dto_1 = require("./dto/update-programacion.dto");
const firebase_auth_guard_1 = require("../../common/guards/firebase-auth.guard");
let ProgramacionesController = class ProgramacionesController {
    constructor(programacionesService) {
        this.programacionesService = programacionesService;
    }
    create(dto, req) {
        return this.programacionesService.createProgramacion(dto, req.user);
    }
    getUserProgramaciones(req) {
        return this.programacionesService.getUserProgramaciones(req.user);
    }
    update(id, dto, req) {
        return this.programacionesService.updateProgramacion(id, dto, req.user);
    }
    delete(id, req) {
        return this.programacionesService.deleteProgramacion(id, req.user);
    }
    toggle(id, req) {
        return this.programacionesService.toggleProgramacion(id, req.user);
    }
};
exports.ProgramacionesController = ProgramacionesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_programacion_dto_1.CreateProgramacionDto, Object]),
    __metadata("design:returntype", void 0)
], ProgramacionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ProgramacionesController.prototype, "getUserProgramaciones", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_programacion_dto_1.UpdateProgramacionDto, Object]),
    __metadata("design:returntype", void 0)
], ProgramacionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProgramacionesController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':id/toggle'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProgramacionesController.prototype, "toggle", null);
exports.ProgramacionesController = ProgramacionesController = __decorate([
    (0, common_1.Controller)('programaciones'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __metadata("design:paramtypes", [programaciones_service_1.ProgramacionesService])
], ProgramacionesController);
//# sourceMappingURL=programaciones.controller.js.map