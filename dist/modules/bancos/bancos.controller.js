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
exports.BancosController = void 0;
const common_1 = require("@nestjs/common");
const bancos_service_1 = require("./bancos.service");
const create_banco_dto_1 = require("./dto/create-banco.dto");
const update_banco_dto_1 = require("./dto/update-banco.dto");
const depositar_dto_1 = require("./dto/depositar.dto");
const retirar_dto_1 = require("./dto/retirar.dto");
const firebase_auth_guard_1 = require("../../common/guards/firebase-auth.guard");
let BancosController = class BancosController {
    constructor(bancosService) {
        this.bancosService = bancosService;
    }
    create(dto, req) {
        return this.bancosService.createBanco(dto, req.user);
    }
    getUserBancos(req) {
        return this.bancosService.getUserBancos(req.user);
    }
    joinByCode(codigo, req) {
        return this.bancosService.joinBancoByCode(codigo, req.user);
    }
    async getBancoById(id, req) {
        const banco = await this.bancosService.getBancoById(id, req.user);
        if (!banco)
            throw new common_1.NotFoundException('Cartera no encontrada');
        return banco;
    }
    updateBanco(id, dto, req) {
        return this.bancosService.updateBanco(id, dto, req.user);
    }
    deleteBanco(id, req) {
        return this.bancosService.deleteBanco(id, req.user);
    }
    depositar(id, dto, req) {
        return this.bancosService.depositar(id, dto, req.user);
    }
    retirar(id, dto, req) {
        return this.bancosService.retirar(id, dto, req.user);
    }
};
exports.BancosController = BancosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_banco_dto_1.CreateBancoDto, Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "getUserBancos", null);
__decorate([
    (0, common_1.Post)('join-by-code'),
    __param(0, (0, common_1.Body)('codigo')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "joinByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BancosController.prototype, "getBancoById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_banco_dto_1.UpdateBancoDto, Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "updateBanco", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "deleteBanco", null);
__decorate([
    (0, common_1.Post)(':id/depositar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, depositar_dto_1.DepositarDto, Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "depositar", null);
__decorate([
    (0, common_1.Post)(':id/retirar'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, retirar_dto_1.RetirarDto, Object]),
    __metadata("design:returntype", void 0)
], BancosController.prototype, "retirar", null);
exports.BancosController = BancosController = __decorate([
    (0, common_1.Controller)('bancos'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __metadata("design:paramtypes", [bancos_service_1.BancosService])
], BancosController);
//# sourceMappingURL=bancos.controller.js.map