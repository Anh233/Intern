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
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  GetCategoriesQueryDto,
  UpdateCategoryDto,
} from './dtos/category.dto';
import { CategoryModel } from './models/category.model';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { AccountService } from 'src/account/account.service';
import { RequestModel } from 'src/auth/models/request.model';

@Controller('api/v1/chat-session/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly accountService: AccountService,
  ) {}

  @Get('all')
  async getAllCategories(
    @Query() query: GetCategoriesQueryDto,
  ): Promise<{ data: CategoryModel[]; total: number }> {
    return await this.categoryService.getCategories(
      query.id,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Get(':id/me')
  async getCategoryById(@Param('id') id: number) {
    return await this.categoryService.getCategoryById(id);
  }

  @Post(':accountId/create')
  async createCategory(
    @Param('accountId') accountId: number,
    @Body() body: CreateCategoryDto,
  ) {
    await this.accountService.getAccount(accountId);
    return await this.categoryService.createCategory(accountId, body.name);
  }

  @Put(':id/update')
  async updateCategory(
    @Param('id') id: number,
    @Body() body: UpdateCategoryDto,
    @Req() req: RequestModel,
  ) {
    await this.categoryService.getCategoryById(id);
    const accountId = req.user.accountId;
    return await this.categoryService.updateCategory(id, body.name, accountId);
  }

  @Delete(':id/delete')
  async deleteCategory(@Param('id') id: number, @Req() req: RequestModel) {
    await this.categoryService.getCategoryById(id);
    const accountId = req.user.accountId;
    return await this.categoryService.deleteCategory(id, accountId);
  }
}
