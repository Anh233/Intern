import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { RoleModel } from './models/role.model';
import { PageListModel } from 'src/utils/models/page-list.model';
import { throwError } from 'src/utils/function';

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
    roleId: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ) {
    const query = this.roleRepository.createQueryBuilder('role');

    if (roleId) {
      query.andWhere('role.roleId = :roleId', { roleId });
    }
    if (q) {
      query.andWhere('role.name LIKE :q', { q: `%${q}%` });
    }
    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const roles = data.map((role) => {
      return new RoleModel(role.roleId, role.name, role.detail);
    });

    return new PageListModel<RoleModel>(total, roles);
  }

  async getRoleById(roleId: number) {
    const role = await this.roleRepository.findOne({
      where: {
        roleId: roleId,
        deletedAt: IsNull(),
      },
    });
    if (!role) {
      throwError(`Role with id ${roleId} not found`);
    }
    return role;
  }

  async updateRole(
    roleId: number,
    name: string | undefined,
    accountId: number,
    detail: string | undefined,
  ) {
    await this.roleRepository.update(
      {
        roleId: roleId,
        deletedAt: IsNull(),
      },
      {
        name,
        detail,
        updateAt: new Date(),
        updateBy: accountId,
      },
    );
    await this.roleRepository.save({ roleId, name, detail });
    return await this.getRoleById(roleId);
  }

  async deleteRole(roleId: number, accountId: number): Promise<boolean> {
    await this.roleRepository.update(
      {
        roleId: roleId,
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
