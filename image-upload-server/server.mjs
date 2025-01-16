import express from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.EXPRESS_PORT || 4174;

// CORS 설정 (환경 변수로 도메인 지정)
const corsOptions = {
  origin: process.env.CORS_ALLOWED_ORIGIN, // 환경 변수로 도메인 설정
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메소드 설정
  allowedHeaders: ['Content-Type', 'Authorization'], // 허용할 헤더 설정
};

app.use(cors(corsOptions));
app.use(express.json());

// AWS SDK configuration
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const polly = new AWS.Polly();

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

// Polly 음성 합성 엔드포인트
app.post('/synthesize-speech', async (req, res) => {
    try {
        const { text } = req.body;
        
        const params = {
            Engine: 'neural',
            LanguageCode: 'ko-KR',
            OutputFormat: 'mp3',
            Text: text,
            TextType: 'text',
            VoiceId: 'Seoyeon'
        };

        const data = await polly.synthesizeSpeech(params).promise();
        
        // AudioStream을 Base64로 인코딩하여 전송
        const audioBase64 = data.AudioStream.toString('base64');
        res.json({ audioContent: audioBase64 });
    } catch (error) {
        console.error('Speech synthesis error:', error);
        res.status(500).json({ error: 'Speech synthesis failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
