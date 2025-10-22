import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { } // 注入PrismaService

  async getHello(): Promise<string> {
    // 查询数据库里所有的笔记
    const notes = await this.prisma.note.findMany();

    // 如果没有笔记，就创建一条
    if (notes.length === 0) {
      await this.prisma.note.create({
        data: {
          title: 'My First Note',
          content: 'This is a test note from the database.',
        },
      });

      return "No notes found, so created one."
    }

    return `Data from DB: ${notes[0].title}`;
  }
}
