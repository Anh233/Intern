import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleEntity } from './entities/role.entity';

@Controller('api/v1/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  async createRole() {
    return await this.roleService.create('Admin', 'Administrator');
  }

  @Get('all')
  async getRoles() {
    return await this.roleService.findAll();
  }

  @Get('find')
  async findRole() {
    return await this.roleService.findById(1);
  }

  @Put('update')
  async updateRole(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('detail') detail: string,
  ): Promise<RoleEntity> {
    return await this.roleService.update(id, name, detail);
  }

  @Delete('delete')
  async deleteRole(@Param('id') id: number): Promise<void> {
    return await this.roleService.remove(id);
  }
}
