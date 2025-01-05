import express from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const app = express();
const PORT = 3001;

app.use(cors());

// AWS SDK configuration using environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.file.originalname, // File name
    Body: req.file.buffer,      // File content
    ContentType: req.file.mimetype, // MIME type (e.g., image/jpeg, text/plain)
  };

  // Upload file to S3
  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading file to S3:', err);
      return res.status(500).json({ error: 'Error uploading file to S3' });
    }
    res.json({ message: 'File uploaded successfully', url: data.Location });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
