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
import { RoleEntity } from './entities/role.entity';
import { RequestModel } from 'src/auth/models/request.model';
import {
  CreateRoleDto,
  GetRolesQueryDto,
  UpdateRoleDto,
} from './dtos/role.dto';
import { RoleModel } from './models/role.model';
import { PaginationModel } from 'src/utils/models/pagination.model';

@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async createRole(
    @Req() request: RequestModel,
    @Body() body: CreateRoleDto,
  ): Promise<RoleEntity> {
    const accountId = request.user.accountId;
    return await this.roleService.createRole(body.name, body.detail, accountId);
  }

  @Get('all')
  async getRoles(
    @Query() query: GetRolesQueryDto,
  ): Promise<{ data: RoleModel[]; total: number }> {
    return await this.roleService.getRoles(
      query.id,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Put(':roleId/update')
  async updateRole(
    @Param('id') id: number, // TO DO
    @Body() body: UpdateRoleDto,
    @Req() request: RequestModel,
  ): Promise<RoleEntity> {
    const accountId = request.user.accountId;
    return await this.roleService.updateRole(
      id,
      body.name,
      accountId,
      body.detail, //To do
    );
  }

  @Delete(':id/delete') // TO DO
  async deleteRole(
    @Req() request: RequestModel,
    @Param('id') id: number,
  ): Promise<boolean> {
    const accountId = request.user.accountId;
    return await this.roleService.deleteRole(id, accountId);
  }
}
