import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async createRole(
    name: string,
    detail: string,
    accountId: number,
  ): Promise<RoleEntity> {
    const newRole = new RoleEntity();
    newRole.name = name;
    newRole.detail = detail;
    newRole.createdAt = new Date();
    newRole.createdBy = accountId;

    return await this.roleRepository.save(newRole);
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }

  async findById(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!role) {
      throw new Error(`Role with id ${id} not found`);
    }
    return role;
  }

  async updateRole(
    id: number,
    name: string,
    detail?: string,
  ): Promise<RoleEntity> {
    await this.roleRepository.update(
      {
        id,
        deletedAt: IsNull(),
      },
      { name, detail },
    );
    return this.findById(id);
  }

  async deleteRole(id: number, accountId: number): Promise<boolean> {
    await this.roleRepository.update(
      {
        id: id,
        deletedAt: IsNull(),
      },
      {
        deletedAt: new Date(),
        deletedBy: accountId,
      },
    );
    return true;
  }
}
