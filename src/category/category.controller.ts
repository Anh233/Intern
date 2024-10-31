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