import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { IsNull, Repository } from 'typeorm';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { GetCategoriesQueryDto } from './dtos/category.dto';
import { PageListModel } from 'src/utils/models/page-list.model';
import { CategoryModel } from './models/category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async getCategories(
    id: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ): Promise<PageListModel<CategoryModel>> {
    const query = this.categoryRepository.createQueryBuilder('category');
    if (id) {
      query.andWhere('category.id = :id', { id });
    }
    if (q) {
      query.andWhere('category.name LIKE :q', { q: `%${q}%` });
    }
    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const categories = data.map((category) => {
      return new CategoryModel(category.id, category.name);
    });
    return new PageListModel<CategoryModel>(total, categories);
  }

  async getCategoryById(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
        deletedAt: IsNull(),
      },
    });
    if (!category) {
      throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async createCategory(
    accountId: number,
    name: string,
  ): Promise<CategoryEntity> {
    const category = new CategoryEntity();
    category.name = name;
    category.createdAt = new Date();
    category.createdBy = accountId;

    return await this.categoryRepository.save(category);
  }

  async updateCategory(
    id: number,
    name: string,
    accountId: number,
  ): Promise<CategoryEntity> {
    await this.categoryRepository.update(
      {
        id: id,
        deletedAt: IsNull(),
      },
      {
        name: name,
        updateAt: new Date(),
        updateBy: accountId,
      },
    );
    return await this.getCategoryById(id);
  }

  async deleteCategory(id: number, accountId: number): Promise<boolean> {
    await this.getCategoryById(id);
    await this.categoryRepository.update(
      { id: id, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: accountId,
      },
    );
    return true;
  }
}
