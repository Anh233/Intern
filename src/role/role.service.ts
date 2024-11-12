import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { RoleModel } from './models/role.model';
import { PageListModel } from 'src/utils/models/page-list.model';

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

  async getRoles(
    id: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ): Promise<PageListModel<RoleModel>> {
    const query = this.roleRepository.createQueryBuilder('role');

    if (id) {
      query.andWhere('role.id = :id', { id });
    }
    if (q) {
      query.andWhere('role.name LIKE :q', { q: `%${q}%` });
    }
    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const roles = data.map((role) => {
      return new RoleModel(role.id, role.name, role.detail);
    });

    return new PageListModel<RoleModel>(total, roles);
  }

  async getRoleById(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error(`Role with id ${id} not found`);
    }
    return role;
  }

  async updateRole(
    id: number,
    name: string,
    accountId: number,
    detail?: string,
  ): Promise<RoleEntity> {
    await this.roleRepository.update(
      {
        id,
        deletedAt: IsNull(),
      },
      { name, detail, updateBy: accountId },
    );
    await this.roleRepository.save({ id, name, detail });
    return await this.getRoleById(id);
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
