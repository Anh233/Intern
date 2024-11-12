import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Query,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RequestModel } from 'src/auth/models/request.model';
import {
  CreateRoleDto,
  GetRoleIdParamDto,
  GetRolesQueryDto,
  UpdateRoleDto,
} from './dtos/role.dto';
import { RoleModel } from './models/role.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { throwError } from 'src/utils/function';
import { throwError } from 'src/utils/function';

@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async createRole(@Req() request: RequestModel, @Body() body: CreateRoleDto) {
  async createRole(@Req() request: RequestModel, @Body() body: CreateRoleDto) {
    const accountId = request.user.accountId;
    if (!body.name || !body.detail) {
      throwError('Name and detail are required');
    }
    if (!body.name || !body.detail) {
      throwError('Name and detail are required');
    }
    return await this.roleService.createRole(body.name, body.detail, accountId);
  }

  @Get('all')
  async getRoles(
    @Query() query: GetRolesQueryDto,
  ): Promise<{ data: RoleModel[]; total: number }> {
    return await this.roleService.getRoles(
      query.roleId,
      query.roleId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Put(':roleId/update')
  async updateRole(
    @Param() params: GetRoleIdParamDto,
    @Body() body: UpdateRoleDto,
    @Req() request: RequestModel,
  ) {
    const roleId = params.roleId;
    const accountId = request.user.accountId;

    return await this.roleService.updateRole(
      roleId,
      roleId,
      body.name,
      accountId,
      body.detail,
      body.detail,
    );
  }

  @Delete(':roleId/delete')
  @Delete(':roleId/delete')
  async deleteRole(
    @Req() request: RequestModel,
    @Param() params: GetRoleIdParamDto,
  ) {
    const roleId = params.roleId;
    const accountId = request.user.accountId;

    return await this.roleService.deleteRole(roleId, accountId);
  }
}
