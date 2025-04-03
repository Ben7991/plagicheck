import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'node:path';
// import * as fs from 'fs/promises';
// import * as pdfParser from 'pdf-parse';
// import * as mammoth from 'mammoth';

import { DocumentType } from 'src/utils/enums/document-type.enum';
import { DataSource, Like } from 'typeorm';
import { DepartmentEntity } from 'src/entities/department.entity';
import { ArchiveEntity } from 'src/entities/archive.entity';

@Injectable()
export class ArchiveService {
  constructor(private readonly dataSource: DataSource) {}

  async paginate(page: number, query: string) {
    const rows = 9;
    const archiveRepo = this.dataSource.getRepository(ArchiveEntity);
    try {
      const count = await archiveRepo.count({
        where: {
          title: Like(`%${query}%`),
        },
      });
      const archives = await archiveRepo.find({
        skip: rows * page,
        take: rows,
        where: {
          title: Like(`%${query}%`),
        },
        order: {
          id: 'desc',
        },
      });

      return { count, data: archives };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async create(file: Express.Multer.File, departmentId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingDepartment = await this.getExistingDepartment(departmentId);
      const documentType = this.getDocumentType(file);

      if (!documentType) {
        throw new BadRequestException('Unsupported file format');
      }

      const archive = new ArchiveEntity();
      archive.filePath = file.filename;
      archive.title = this.getFileName(file.originalname);
      archive.department = existingDepartment;
      archive.documentType = documentType;

      const storedArchive = await queryRunner.manager.save(archive);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return storedArchive;
    } catch (error) {
      await queryRunner.commitTransaction();
      await queryRunner.release();

      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException((error as Error).message);
    }
  }

  private async getExistingDepartment(departmentId: number) {
    const existingDepartment = await this.dataSource.manager.findOneBy(
      DepartmentEntity,
      {
        id: departmentId,
      },
    );

    if (!existingDepartment) {
      throw new BadRequestException('Selected department does not exist');
    }

    return existingDepartment;
  }

  private getFileName(originalname: string) {
    const extensionIndex = originalname.lastIndexOf('.');
    return originalname.slice(0, extensionIndex);
  }

  private getDocumentType(file: Express.Multer.File): DocumentType | undefined {
    const fileExtension = file.mimetype.toLowerCase();

    switch (fileExtension) {
      case 'text/plain':
        return DocumentType.TEXT;
      case 'application/pdf':
        return DocumentType.PDF;
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return DocumentType.WORD;
      default:
        return undefined;
    }
  }

  // private async getFileContent(filePath: string, documentType: DocumentType) {
  //   if (documentType === DocumentType.TEXT) {
  //     const buffer = await fs.readFile(filePath);
  //     return buffer.toString();
  //   } else if (documentType === DocumentType.PDF) {
  //     const buffer = await fs.readFile(filePath);
  //     const result = await pdfParser(buffer);
  //     return result.text;
  //   } else {
  //     const result = await mammoth.extractRawText({ path: filePath });
  //     return result.value;
  //   }
  // }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingArchive = await queryRunner.manager.findOneBy(
        ArchiveEntity,
        {
          id,
        },
      );

      if (!existingArchive) {
        throw new BadRequestException('Archive to delete is not recognized');
      }

      await this.removeFile(existingArchive.filePath);

      await queryRunner.manager.delete(ArchiveEntity, {
        id,
      });
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: 'Archive deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      if (error as BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }

      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async removeFile(fileName: string) {
    const filePath = path.join(process.cwd(), 'uploads', 'archive', fileName);

    if (!fs.existsSync(filePath)) {
      return Promise.resolve();
    }

    await fs.promises.unlink(filePath);
  }

  async getFilePathToDownload(id: number) {
    const archiveRepo = this.dataSource.getRepository(ArchiveEntity);

    try {
      const existingFile = await archiveRepo.findOneBy({
        id,
      });

      if (!existingFile) {
        throw new BadRequestException('File to download does not exist');
      }

      const filePath = path.join(
        process.cwd(),
        'uploads',
        'archive',
        existingFile.filePath,
      );
      return fs.createReadStream(filePath);
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
