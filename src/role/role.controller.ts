import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from './entities/role.entity';
import { RequestModel } from 'src/auth/models/request.model';
import { CreateRoleDto, UpdateRoleDto } from './dtos/role.dto';

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
  async getRoles() {
    return await this.roleService.findAll();
  }

  @Put(':roleId/update')
  async updateRole(
    @Param('id') id: number, // TO DO
    @Body() body: UpdateRoleDto,
  ): Promise<RoleEntity> {
    await this.roleService.findById(id);
    return await this.roleService.updateRole(id, body.name, body.detail);
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
