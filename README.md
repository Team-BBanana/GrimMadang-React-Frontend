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

### Canvas
- Fabric.js

### Others
- Axios (API 통신)
- React Router (라우팅)

## 🗂️ 프로젝트 구조

```
src/
├── api/          # API 통신 관련 
├── components/   # 공통 컴포넌트
├── hooks/        # 커스텀 훅
│   ├── useSpeechRecognition.ts    # 음성 인식 훅
│   ├── usePollyTTS.ts             # AWS Polly TTS 훅
│   └── useCanvasState.ts          # 캔버스 상태 관리 훅
├── pages/        # 페이지 컴포넌트
│   ├── Gallery/  # 갤러리 페이지
│   └── Canvas/   # 캔버스 페이지
├── styles/       # 전역 스타일
└── utils/        # 유틸리티 함수
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
- 실시간 저장 및 복구

### 3. AI 피드백 시스템
- 단계별 그림 평가
- 긍정적 피드백 제공
- 성취 시스템 연동

### 4. 갤러리 시스템
- 작품 자동 저장
- 가족 공유 기능
- 전시 시스템

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
# AWS Polly Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=your_region

# API Configuration
VITE_API_BASE_URL=your_api_url

# Other Configurations
VITE_APP_ENV=development
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
