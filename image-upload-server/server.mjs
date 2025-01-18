import express from 'express';
import AWS from 'aws-sdk';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.EXPRESS_PORT || 4174;

// CORS 설정 수정
const corsOptions = {
  origin: ['http://localhost:4173', 'http://127.0.0.1:4173','https://grim-madang.store'],  // 모든 가능한 로컬 프론트엔드 주소 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  optionsSuccessStatus: 200
};

// CORS 미들웨어를 가장 앞에 배치
app.use(cors(corsOptions));
app.use(express.json());

// 모든 라우트에 대해 CORS 헤더 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// preflight 요청을 위한 OPTIONS 메소드 처리
app.options('*', (req, res) => {
  res.status(200).end();
});

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

// Polly 음성 합성 엔드포인트 수정
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
        
        // CORS 헤더 명시적 설정
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        
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
