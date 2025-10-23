import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { NotesModule } from './notes/notes.module';


@Module({
  imports: [NotesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule { }
