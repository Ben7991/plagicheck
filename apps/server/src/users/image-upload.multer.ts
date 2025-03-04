import { diskStorage } from 'multer';
import { join } from 'path';

export const uploadValidation = {
  fileFilter: (
    _,
    file: Express.Multer.File,
    callback: (error: Error | null, status: boolean) => void,
  ) => {
    const acceptableMimeTypes = ['image/jpg', 'image/png', 'image/jpeg'];
    const fileMimeType = file.mimetype.toLocaleLowerCase();

    if (acceptableMimeTypes.includes(fileMimeType)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  storage: diskStorage({
    destination(_, __, callback) {
      callback(null, join(process.cwd(), 'uploads'));
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
};
