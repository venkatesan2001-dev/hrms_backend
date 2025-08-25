import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
    dest: './company_uploads',
    storage: diskStorage({
        destination: './company_uploads',
        filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const fileExtension = path.extname(file.originalname);
            const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
            callback(null, fileName);
        },
    }),
};
