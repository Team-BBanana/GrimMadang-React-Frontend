// Base64 데이터 URL을 Blob 객체로 변환하는 함수
export const dataURLToBlob = (dataURL: string) => {
  // Base64 데이터를 디코딩
  const byteString = atob(dataURL.split(',')[1]);
  // MIME 타입 추출
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
  // ArrayBuffer 생성
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  
  // 바이트 데이터를 ArrayBuffer에 쓰기
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  
  // Blob 객체 생성 및 반환
  return new Blob([ab], { type: mimeString });
};

// 지정된 길이의 랜덤 문자열을 생성하는 함수
export const generateRandomString = (length: number = 8) => {
  // 사용할 문자 세트
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // 지정된 길이만큼 랜덤 문자 선택
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}; 