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
exports.GoalsController = void 0;
const common_1 = require("@nestjs/common");
const goals_service_1 = require("./goals.service");
const create_goal_dto_1 = require("./dto/create-goal.dto");
const update_goal_dto_1 = require("./dto/update-goal.dto");
const join_goal_dto_1 = require("./dto/join-goal.dto");
const contribuir_dto_1 = require("./dto/contribuir.dto");
const firebase_auth_guard_1 = require("../../common/guards/firebase-auth.guard");
let GoalsController = class GoalsController {
    constructor(goalsService) {
        this.goalsService = goalsService;
    }
    create(dto, req) {
        return this.goalsService.createGoal(dto, req.user);
    }
    getUserGoals(req) {
        return this.goalsService.getUserGoals(req.user);
    }
    joinByCode(dto, req) {
        return this.goalsService.joinGoalByCode(dto.codigo, req.user);
    }
    async getGoalById(id) {
        const goal = await this.goalsService.getGoalById(id);
        if (!goal)
            throw new common_1.NotFoundException('Meta no encontrada');
        return goal;
    }
    updateGoal(id, dto, req) {
        return this.goalsService.updateGoal(id, dto, req.user);
    }
    deleteGoal(id, req) {
        return this.goalsService.deleteGoal(id, req.user);
    }
    contribute(id, dto, req) {
        return this.goalsService.contributeToGoal(id, dto, req.user);
    }
    async getControlCuotas(id) {
        const cuotas = await this.goalsService.getGoalControlCuotas(id);
        if (cuotas === null)
            throw new common_1.NotFoundException('Meta no encontrada');
        return cuotas;
    }
};
exports.GoalsController = GoalsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_goal_dto_1.CreateGoalDto, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "getUserGoals", null);
__decorate([
    (0, common_1.Post)('join-by-code'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [join_goal_dto_1.JoinGoalDto, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "joinByCode", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "getGoalById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_goal_dto_1.UpdateGoalDto, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "updateGoal", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "deleteGoal", null);
__decorate([
    (0, common_1.Post)(':id/contribuir'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contribuir_dto_1.ContribuirDto, Object]),
    __metadata("design:returntype", void 0)
], GoalsController.prototype, "contribute", null);
__decorate([
    (0, common_1.Get)(':id/control_cuotas'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GoalsController.prototype, "getControlCuotas", null);
exports.GoalsController = GoalsController = __decorate([
    (0, common_1.Controller)('goals'),
    (0, common_1.UseGuards)(firebase_auth_guard_1.FirebaseAuthGuard),
    __metadata("design:paramtypes", [goals_service_1.GoalsService])
], GoalsController);
//# sourceMappingURL=goals.controller.js.map