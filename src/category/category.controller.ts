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
  CreateCategoryBodyDto,
  GetAccountIdParamDto,
  GetCategoriesQueryDto,
  GetCategoryIdParamDto,
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

  @Get(':categoryId/detail')
  async getCategoryById(@Param() params: GetCategoryIdParamDto) {
    return await this.categoryService.getCategoryById(params.categoryId);
  }

  @Get('all')
  async getCategories(@Query() query: GetCategoriesQueryDto) {
    const categoryId = query.categoryId;
    return await this.categoryService.getCategories(
      categoryId,
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post(':accountId/create')
  async createCategory(
    @Param() params: GetAccountIdParamDto,
    @Body() body: CreateCategoryBodyDto,
  ) {
    const accountId = params.accountId;
    await this.accountService.getAccount(accountId, true);
    return await this.categoryService.createCategory(accountId, body.name);
  }

  @Put(':categoryId/update')
  async updateCategory(
    @Param() params: GetCategoryIdParamDto,
    @Body() body: UpdateCategoryBodyDto,
    @Req() req: RequestModel,
  ) {
    const categoryId = params.categoryId;
    await this.categoryService.getCategoryById(categoryId);
    const accountId = req.user.accountId;
    return await this.categoryService.updateCategory(
      categoryId,
      body.name,
      accountId,
    );
  }

  @Delete(':categoryId/delete') //sau bỏ thêm chatSessionId
  async deleteCategory(
    @Param() params: GetCategoryIdParamDto,
    @Req() req: RequestModel,
  ) {
    const categoryId = params.categoryId;

    await this.categoryService.getCategoryById(categoryId);
    const accountId = req.user.accountId;
    return await this.categoryService.deleteCategory(categoryId, accountId);
  }
}
