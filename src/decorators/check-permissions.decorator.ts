import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PermissionsGuard } from 'src/guards/permissions.guard';

export function CheckPermissions() {
  return applyDecorators(
    SetMetadata('permissions', true),
    UseGuards(PermissionsGuard),
  );
}
