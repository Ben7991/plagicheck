import * as path from 'node:path';
import { diskStorage } from 'multer';

export const archiveMulterOptions = {
  storage: diskStorage({
    destination(_, __, callback) {
      callback(null, path.join(process.cwd(), 'uploads', 'archive'));
    },
    filename(_, file, callback) {
      if (!file) {
        callback(null, '');
      }
      const extensionIndex = file.originalname.lastIndexOf('.');
      const extension = file.originalname.substring(
        extensionIndex + 1,
        file.originalname.length,
      );
      const fileName = `${Date.now()}.${extension}`;
      callback(null, fileName);
    },
  }),
  fileFilter(
    _,
    file: Express.Multer.File,
    callback: (error: Error | null, accept: boolean) => void,
  ) {
    const acceptedFileMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    const fileExtension = file.mimetype.toLowerCase();

    if (!acceptedFileMimeTypes.includes(fileExtension)) {
      callback(null, false);
    } else {
      callback(null, true);
    }
  },
};
