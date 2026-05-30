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
exports.CatalogoBancosController = void 0;
const common_1 = require("@nestjs/common");
const catalogo_bancos_service_1 = require("./catalogo-bancos.service");
const create_catalogo_banco_dto_1 = require("./dto/create-catalogo-banco.dto");
const update_catalogo_banco_dto_1 = require("./dto/update-catalogo-banco.dto");
const firebase_auth_guard_1 = require("../../common/guards/firebase-auth.guard");
const admin_guard_1 = require("../../common/guards/admin.guard");
let CatalogoBancosController = class CatalogoBancosController {
    constructor(catalogoBancosService) {
        this.catalogoBancosService = catalogoBancosService;
    }
    getAll() {
        return this.catalogoBancosService.getAll();
    }
    getPublicos() {
        return this.catalogoBancosService.getPublicos();
    }
    create(dto) {
        return this.catalogoBancosService.create(dto);
    }
    update(id, dto) {
        return this.catalogoBancosService.update(id, dto);
    }
    delete(id) {
        return this.catalogoBancosService.delete(id);
    }
};
exports.CatalogoBancosController = CatalogoBancosController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogoBancosController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)('disponibles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CatalogoBancosController.prototype, "getPublicos", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_catalogo_banco_dto_1.CreateCatalogoBancoDto]),
    __metadata("design:returntype", void 0)
], CatalogoBancosController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_catalogo_banco_dto_1.UpdateCatalogoBancoDto]),
    __metadata("design:returntype", void 0)
], CatalogoBancosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(admin_guard_1.AdminGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CatalogoBancosController.prototype, "delete", null);
exports.CatalogoBancosController = CatalogoBancosController = __decorate([
    (0, common_1.Controller)('catalogo-bancos'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __metadata("design:paramtypes", [catalogo_bancos_service_1.CatalogoBancosService])
], CatalogoBancosController);
//# sourceMappingURL=catalogo-bancos.controller.js.map