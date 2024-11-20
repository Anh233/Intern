import { BadRequestException } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';

export const multerOptions: MulterModuleOptions = {
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!fileTypes.includes(file.mimetype)) {
      return cb(
        new BadRequestException(
          'Invalid file format. Allowed formats: jpeg, jpg, png',
        ),
        false,
      );
    }
    cb(null, true);
  },
};
