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
  GetCategoriesQueryDto,
  GetCategoryIdParamDto,
  UpdateCategoryBodyDto,
} from './dtos/category.dto';
import { RequestModel } from 'src/auth/models/request.model';
import { CategoryService } from './category.service';
import { AccountService } from 'src/account/account.service';
import { PaginationModel } from 'src/utils/models/pagination.model';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chat Session / Category')
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
    return await this.categoryService.getCategories(
      new PaginationModel(query.page, query.limit),
      query.q,
    );
  }

  @Post('create')
  async createCategory(
    @Req() req: RequestModel,
    @Body() body: CreateCategoryBodyDto,
  ) {
    const accountId = req.user.accountId;
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
    const accountId = req.user.accountId;

    const category = await this.categoryService.getCategoryById(categoryId);

    return await this.categoryService.updateCategory(
      category,
      body.name,
      accountId,
    );
  }

  @Delete(':categoryId/delete')
  async deleteCategory(
    @Param() params: GetCategoryIdParamDto,
    @Req() req: RequestModel,
  ) {
    const categoryId = params.categoryId;
    const accountId = req.user.accountId;

    const category = await this.categoryService.getCategoryById(categoryId);
    return await this.categoryService.deleteCategory(category, accountId);
  }
}
