# 그림마당 (Frontend)

어르신들의 인지 능력 향상과 정서적 안정을 위한 AI 기반 그림 그리기 서비스

## 📌 프로젝트 소개

그림마당은 어르신들이 AI와의 자연스러운 대화를 통해 그림을 그리고, 가족들과 소통할 수 있는 웹 서비스입니다. 
복잡한 UI 없이 음성 인터랙션만으로 서비스를 이용할 수 있어 어르신들의 접근성을 극대화했습니다.

### 주요 기능
- 🎨 AI와 대화하며 그림 그리기
- 🗣️ 음성 기반 상호작용
- 💝 실시간 AI 피드백
- 🏆 단계별 성취 시스템
- 👨‍👩‍👧‍👦 가족과의 작품 공유

## 🛠️ 기술 스택

### Core
- React
- TypeScript
- Vite

### State Management
- React Context API
- Custom Hooks
- Jotai

### Styling
- CSS Modules

### Voice Interaction
- Web Speech API (음성 인식)
- AWS Polly (음성 합성)
  - 자연스러운 한국어 음성 출력
  - 감정과 톤을 고려한 음성 생성
  - 실시간 음성 스트리밍

### AWS 서비스 
- AWS S3 (이미지 저장)
- AWS Polly (음성 합성)

### Canvas
- Fabric.js

### Others
- Axios (API 통신)
- React Router (라우팅)
- express.js(s3,polly)

## 🗂️ 프로젝트 구조

```
src/
├── api/                  # API 통신 관련
│   ├── canvas.api/      # 캔버스 관련 API
│   ├── gallery.api/     # 갤러리 관련 API
│   ├── postCard.api/    # 엽서 관련 API
│   └── user.api/        # 사용자 관련 API
│
├── components/          # 공통 컴포넌트
│   ├── Button/         # 버튼 컴포넌트
│   ├── Footer/         # 푸터 컴포넌트
│   ├── Header/         # 헤더 컴포넌트
│   ├── InputBox/       # 입력 컴포넌트
│   └── LoadingSpinner/ # 로딩 컴포넌트
│
├── hooks/              # 커스텀 훅
│   ├── useBackgroundMusic.ts
│   ├── useCanvasState.ts
│   ├── useElderInfo.ts
│   ├── useSpeechCommands.ts
│   ├── useSpeechSynthesis.ts
│   └── useTutorialState.ts
│
├── pages/             # 페이지 컴포넌트
│   ├── Login/        # 로그인 페이지
│   ├── Signup/       # 회원가입 페이지
│   ├── Gallery/      # 갤러리 페이지
│   ├── Canvas/       # 캔버스 페이지
│   ├── Display/      # 작품 상세 페이지
│   └── PostCard/     # 엽서 페이지
│
├── store/            # 상태 관리
│   └── atoms/        # Jotai atoms
│
├── assets/          # 정적 리소스
│   ├── imgs/       # 이미지 파일
│   └── svgs/       # SVG 아이콘
│
└── utils/          # 유틸리티 함수
```

## 🔍 주요 기능 설명

### 1. 음성 기반 인터랙션
- `useSpeechRecognition` 훅을 통한 음성 인식
- `usePollyTTS` 훅을 통한 AWS Polly 음성 출력
  - 자연스러운 한국어 음성 제공
  - 감정을 담은 음성 피드백
  - 실시간 스트리밍으로 빠른 응답
- 음성 상태에 따른 UI 피드백 제공

### 2. 캔버스 기능
- Fabric.js 기반 그리기 도구
- 직관적인 브러시 도구 제공
- 실시간 피드백 제공

### 3. AI 피드백 시스템
- 3단계 단계별 그림 평가
  - 기준 이미지와 점수 기반 비교 하여 피드백 제공, 사용자 에게는 점수는 비공개
- 긍정적 피드백 제공

### 4. 갤러리 시스템
- 작품 자동 저장 기능 
- 카카오톡을 통한 가족 공유 기능
- 가족들이 접속하여 그림을 구경할 수 있는 전시 기능

## 💻 설치 및 실행

```bash
# 저장소 클론
git clone [repository-url]

# 종속성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 실행 
npm run start 

# 빌드
npm run build
```

## 🔒 환경 변수 설정

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-northeast-2
AWS_BUCKET_NAME=your_bucket_name

# API URLs
VITE_CANVAS_API_URL=http://localhost:8080/
VITE_AI_API_URL=http://localhost:3012/

# Kakao API
VITE_KAKAO_API_KEY=your_kakao_api_key

# AWS Server
VITE_UPLOAD_SERVER_URL=http://localhost:4174
EXPRESS_PORT=4174

# CORS
CORS_ALLOWED_ORIGIN=http://localhost:4173
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

© 2025 Krafton Jungle 7th team BBANANA. all rights reserved

## 🙏 Acknowledgments

- [관련 기사 1](https://www.newspeak.kr/news/articleView.html?idxno=126525)
- [관련 기사 2](https://www.hankyung.com/article/202101179426Y)
- [관련 기사 3](https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0002917287)

## 📱 페이지 구조

```
/
├── /                     # 로그인 페이지
│   └── 카카오 소셜 로그인
│
├── /signup               # 회원가입 페이지
│   └── 역할 선택 (어르신/가족)
│
├── /gallery              # 갤러리 페이지
│   ├── AI와 대화를 통한 그림 그리기 시작
│   └── 그림 목록 조회
│
├── /canvas               # 캔버스 페이지
│   ├── 3단계 그림 그리기
│   └── AI 실시간 피드백
│
├── /gallery/:id          # 작품 상세 페이지
│   ├── 작품 상세 조회
│   └── 작품 공유
│
└── /postcard/:id         # 엽서 페이지
    ├── 작품 엽서 형태 조회
    └── 카카오톡 공유
```

### 페이지별 설명

#### 🔐 메인 페이지 (`/`)
- 카카오 소셜 로그인
- 서비스 소개

#### 📝 회원가입 페이지 (`/signup`)
- 어르신/가족 구분을 위한 역할 설정
- 기본 정보 입력

#### 🖼️ 갤러리 페이지 (`/gallery`)
- AI와의 자연스러운 대화를 통한 그림 그리기 시작
- 완성된 작품들의 목록 조회
- 음성 명령을 통한 페이지 탐색

#### 🎨 캔버스 페이지 (`/canvas`)
- 3단계로 구성된 그림 그리기 기능
- 각 단계별 AI의 실시간 피드백
- 완성된 작품 자동 저장

#### 🖼️ 작품 상세 페이지 (`/gallery/:id`)
- 작품 상세 정보 조회
- 작품 공유 기능

#### 💌 엽서 페이지 (`/postcard/:id`)
- 작품을 엽서 형태로 표시
- 카카오톡을 통한 공유 기능
