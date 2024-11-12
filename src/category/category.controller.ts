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
import {
  CreateCategoryDto,
  GetCategoriesQueryDto,
  UpdateCategoryBodyDto,
} from './dtos/category.dto';
import { RequestModel } from 'src/auth/models/request.model';
import { CategoryService } from './category.service';
import { AccountService } from 'src/account/account.service';
import { PaginationModel } from 'src/utils/models/pagination.model';

@Controller('api/v1/chat-session/category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly accountService: AccountService,
  ) {}

  @Get(':categoryId')
  async getCategoryById(@Param('categoryId') categoryId: number) {
    return await this.categoryService.getCategoryById(categoryId);
  }

  @Get('all')
  async getCategories(
    @Query() query: GetCategoriesQueryDto,
    @Req() req: RequestModel,
  ) {
    const accountId = req.user.accountId;
    return await this.categoryService.getCategories(
      accountId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post(':accountId/create')
  async createCategory(
    @Param() params: GetAccountIdParamDto,
    @Body() body: CreateCategoryDto,
  ) {
    await this.accountService.getAccount(accountId, true);
    return await this.categoryService.createCategory(accountId, body.name);
  }

  @Put(':categoryId/update')
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() body: UpdateCategoryBodyDto,
    @Req() req: RequestModel,
  ) {
    await this.categoryService.getCategoryById(categoryId);
    const accountId = req.user.accountId;
    return await this.categoryService.updateCategory(
      categoryId,
      body.name,
      accountId,
    );
  }

  @Delete(':categoryId/delete')
  async deleteCategory(
    @Param('categoryId') categoryId: number,
    @Req() req: RequestModel,
  ) {
    await this.categoryService.getCategoryById(categoryId);
    const accountId = req.user.accountId;
    return await this.categoryService.deleteCategory(categoryId, accountId);
  }
}
