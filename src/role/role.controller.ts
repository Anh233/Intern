import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RequestModel } from 'src/auth/models/request.model';
import {
  CreateRoleBodyDto,
  GetRoleIdParamDto,
  GetRolesQueryDto,
  UpdateRoleBodyDto,
} from './dtos/role.dto';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async createRole(@Req() req: RequestModel, @Body() body: CreateRoleBodyDto) {
    const reqAccountId = req.user.accountId;
    return await this.roleService.createRole(
      body.name,
      body.detail,
      reqAccountId,
    );
  }

  @Get(':roleId/detail')
  async getRole(@Param() params: GetRoleIdParamDto) {
    const roleId = params.roleId;
    return await this.roleService.getRoleById(roleId);
  }

  @Get('all')
  async getRoles(@Query() query: GetRolesQueryDto) {
    return await this.roleService.getRoles(
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Put(':roleId/update')
  async updateRole(
    @Param() params: GetRoleIdParamDto,
    @Body() body: UpdateRoleBodyDto,
    @Req() req: RequestModel,
  ) {
    const roleId = params.roleId;
    const accountId = req.user.accountId;

    return await this.roleService.updateRole(
      roleId,
      body.name,
      body.detail,
      accountId,
    );
  }

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
