# Build stage
FROM node:18-alpine as build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 소스 코드 복사
COPY . .

# 프로덕션 빌드
RUN npm run build

# 프로덕션 서빙을 위한 포트들
EXPOSE 4173
EXPOSE 4174

# 정적 파일 서빙을 위한 serve 설치
RUN npm install -g serve

# 두 서버 실행
CMD serve -s dist -l 4173 & node image-upload-server/server.mjs 