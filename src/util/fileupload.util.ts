import cloudinary from '@src/util/cloudinary.util';
import multer from 'multer';

export const uploadImage = (file: any, dynamicPath: string | undefined): Promise<{ url?: string; error?: string }> => {
  return new Promise((resolve, reject) => {
    try {
      if (!dynamicPath) {
        dynamicPath = "uploads";
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: dynamicPath, // Specify a folder in Cloudinary if desired
          resource_type: 'auto' // Automatically detect file type
        },
        (error, result) => {
          if (error) {
            resolve({ error: `An error occurred while uploading the file: ${error.message}` });
          } else {
            resolve({ url: result?.secure_url });
          }
        }
      );

      uploadStream.end(file.buffer); // Use the file buffer directly
    } catch (error) {
      resolve({ error: error.message });
    }
  });
};


const fileFilter = (req: any, file: any, cb: any) => {
    // Check file type (you can add more validation here)
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not supported'), false);
    }
};

const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter
});

export default upload;