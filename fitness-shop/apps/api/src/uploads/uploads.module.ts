import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [AuthModule],
    controllers: [UploadsController],
})
export class UploadsModule { }