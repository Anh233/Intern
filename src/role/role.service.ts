import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleEntity } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  async create(name: string, detail?: string): Promise<RoleEntity> {
    const role = this.roleRepository.create({ name, detail });
    return this.roleRepository.save(role);
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }

  async findById(id: number): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) {
      throw new Error(`Role with id ${id} not found`);
    }
    return role;
  }

  async update(id: number, name: string, detail?: string): Promise<RoleEntity> {
    await this.roleRepository.update(id, { name, detail });
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }
}
