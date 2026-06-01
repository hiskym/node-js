import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { AdminGuard } from '../auth/guards/admin.guard';

const uploadDir = join(process.cwd(), 'uploads/products');

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

function ensureUploadDirExists() {
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir, { recursive: true });
  }
}

function createSafeFilename(originalName: string) {
  const extension = extname(originalName).toLowerCase();
  const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

  return `${uniqueName}${extension}`;
}

@Controller('admin/uploads')
@UseGuards(AdminGuard)
export class UploadsController {
  @Post('product-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_request, _file, callback) => {
          ensureUploadDirExists();
          callback(null, uploadDir);
        },
        filename: (_request, file, callback) => {
          callback(null, createSafeFilename(file.originalname));
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: (_request, file, callback) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
          callback(
            new BadRequestException('Only jpg, png and webp images are allowed'),
            false,
          );
          return;
        }

        callback(null, true);
      },
    }),
  )
  uploadProductImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return {
      imageUrl: `/uploads/products/${file.filename}`,
    };
  }
}