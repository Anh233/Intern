import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { PageListModel } from 'src/utils/models/page-list.model';
import { CategoryModel } from './models/category.model';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  public getDefaultCategoryId(): number {
    return 1;
  }

  async getCategories(
    categoryId: number | undefined,
    pagination: PaginationModel,
    q: string | undefined,
  ): Promise<PageListModel<CategoryModel>> {
    const query = this.categoryRepository.createQueryBuilder('category');

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    if (q) {
      query.andWhere('category.name LIKE :q', { q: `%${q}%` });
    }

    const [data, total] = await query
      .skip((pagination.page - 1) * pagination.limit)
      .take(pagination.limit)
      .getManyAndCount();

    const categories = data.map(
      (category) => new CategoryModel(category.categoryId, category.name),
    );

    return new PageListModel<CategoryModel>(total, categories);
  }

  async getCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: {
        categoryId: categoryId,
        deletedAt: IsNull(),
      },
    });
    if (!category) {
      throw new HttpException('CATEGORY_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async createCategory(accountId: number, name: string) {
    const category = new CategoryEntity();
    category.name = name;
    category.createdAt = new Date();
    category.createdBy = accountId;

    return await this.categoryRepository.save(category);
  }

  async updateCategory(
    categoryId: number,
    name: string,
    accountId: number,
  ): Promise<CategoryEntity> {
    await this.categoryRepository.update(
      {
        categoryId: categoryId,
        deletedAt: IsNull(),
      },
      {
        name: name,
        updateAt: new Date(),
        updateBy: accountId,
      },
    );
    return await this.getCategoryById(categoryId);
  }

  async deleteCategory(
    categoryId: number,
    accountId: number,
  ): Promise<boolean> {
    await this.getCategoryById(categoryId);
    await this.categoryRepository.update(
      { categoryId: categoryId, deletedAt: IsNull() },
      {
        deletedAt: new Date(),
        deletedBy: accountId,
      },
    );
    return true;
  }

  async findCategoryByName(reqAccountId: number, name: string) {
    let category = await this.categoryRepository.findOne({
      where: {
        name: name,
        deletedAt: IsNull(),
      },
    });
    if (!category) {
      category = await this.createCategory(reqAccountId, name);
      category = await this.categoryRepository.save(category);
    }
    return category;
  }
}
