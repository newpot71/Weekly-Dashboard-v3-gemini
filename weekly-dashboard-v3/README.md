# 프로젝트영업담당 주간보고 대시보드 v3
## Gemini AI 자동 분석 + 웹 대시보드

---

## 📦 패키지 구성

```
weekly-dashboard-v3/
├── frontend/
│   └── index.html              ← 웹 대시보드 앱
├── backend/
│   ├── server.js               ← Express 서버 (메인)
│   ├── routes/
│   │   └── analyze.js          ← Gemini API 분석 라우터
│   ├── utils/
│   │   └── gemini-client.js    ← Gemini AI 클라이언트
│   ├── package.json            ← 의존성 목록
│   ├── .env.sample             ← 환경변수 템플릿 ★
│   └── .gitignore
└── README.md                   ← 이 파일
```

---

## 🚀 사용 방법 (매주 반복)

### 입력 방법 2가지

```
방법 A: 파일 업로드
└── .txt / .json / .docx / .pdf 파일 업로드

방법 B: 텍스트 직접 입력 ← 보안 정책으로 파일 업로드 막힌 경우
└── 주간보고 내용 또는 JSON을 텍스트 창에 붙여넣기
    - JSON 형식이면 즉시 대시보드 변환 (Gemini 불필요)
    - 일반 텍스트면 Gemini AI가 자동 분석
```

### 매주 흐름

```
① 서버 실행 (backend 폴더에서)
   $ npm start

② 브라우저에서 접속
   http://localhost:3000

③ 파일 업로드 또는 텍스트 직접 입력

④ [Gemini AI로 분석 시작] 버튼 클릭

⑤ 대시보드 자동 생성 확인

⑥ [대시보드 저장] 클릭
   → 주간보고_대시보드_W14_2025-04-07.html 생성
   → 팀원 및 타 담당에게 HTML 파일 공유
```

---

## ⚙️ 최초 설치 가이드

### Step 1. Node.js 설치

```
1. https://nodejs.org 접속
2. LTS 버전 다운로드 (예: v20.x.x LTS)
3. 설치 파일 실행 → 기본값으로 설치

설치 확인:
$ node --version   → v20.x.x 출력되면 성공
$ npm --version    → v10.x.x 출력되면 성공
```

### Step 2. Gemini API 키 발급

```
1. https://aistudio.google.com/app/apikey 접속
   (Google 계정 필요)

2. [Create API Key] 클릭

3. API 키 복사 (예: AIzaSy...)

4. ★ 이 키는 절대 다른 사람에게 공유하지 마세요!
```

### Step 3. 환경변수 설정

```
1. backend 폴더로 이동

2. .env.sample 파일을 복사하여 .env 파일 생성:

   Windows:
   $ copy .env.sample .env

   Mac/Linux:
   $ cp .env.sample .env

3. .env 파일을 메모장(IDE)으로 열기

4. 아래 내용 수정:
   GEMINI_API_KEY=여기에_발급받은_API_키_입력

   예시:
   GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   PORT=3000
```

### Step 4. 의존성 패키지 설치

```
1. backend 폴더에서 터미널 열기
   (IDE에서 터미널 탭 클릭)

2. 아래 명령어 실행:
   $ npm install

3. 완료 메시지 확인:
   added XXX packages ...
```

### Step 5. 서버 실행

```
$ npm start

성공 시 출력:
========================================
  프로젝트영업담당 주간보고 대시보드
========================================
  서버 주소: http://localhost:3000
  Gemini API: ✅ 설정됨
========================================
```

### Step 6. 브라우저에서 접속

```
Chrome 또는 Edge 열기
주소창에 입력: http://localhost:3000
```

---

## 🔧 Google Anthos IDE 환경 설정

```
1. IDE에서 weekly-dashboard-v3 폴더 열기

2. 왼쪽 파일 트리에서 backend 폴더 선택

3. 터미널 열기 (Ctrl + ` 또는 Terminal 메뉴)

4. 경로 확인:
   $ pwd
   → .../weekly-dashboard-v3/backend 이어야 함

5. 패키지 설치:
   $ npm install

6. .env 파일 생성:
   $ copy .env.sample .env  (Windows)
   → IDE에서 .env 파일 열어 API 키 입력

7. 서버 실행:
   $ npm start
```

---

## ❓ 자주 묻는 질문

### Q1. 서버 없이 사용할 수 있나요?
```
A: 네! 두 가지 방법으로 가능합니다.
   1. JSON 형식의 텍스트를 입력창에 붙여넣기
      → 서버/Gemini 없이 즉시 대시보드 생성
   2. [샘플 데이터로 미리보기] 버튼
      → 샘플 데이터로 UI 확인
```

### Q2. Gemini API가 회사 정책으로 차단된 경우?
```
A: 텍스트 직접 입력 탭을 사용하세요.
   M365 Copilot 에이전트에서 JSON을 생성하고
   해당 JSON을 텍스트 입력창에 붙여넣으면
   서버 없이도 대시보드가 생성됩니다.
```

### Q3. 서버가 실행되지 않을 때?
```
A: 아래를 순서대로 확인하세요.
   1. Node.js 설치 여부: node --version
   2. .env 파일 존재 여부
   3. GEMINI_API_KEY 올바른지 확인
   4. 포트 3000이 다른 프로그램에 사용 중인지 확인
      → .env 파일에서 PORT=3001로 변경 후 재시작
```

### Q4. 서버를 종료하려면?
```
A: 터미널에서 Ctrl + C 입력
```

### Q5. 매번 서버를 켜야 하나요?
```
A: 네, 사용할 때마다 backend 폴더에서
   npm start로 서버를 켜야 합니다.
   (IDE를 열고 터미널에서 실행)
```

---

## 📋 지원 파일 형식

| 형식 | 확장자 | 비고 |
|------|--------|------|
| 텍스트 | .txt | ✅ 최적 |
| JSON | .json | ✅ 즉시 변환 |
| Word | .docx | ✅ 지원 |
| PDF | .pdf | ✅ 지원 |

---

## 🔒 보안 주의사항

```
⚠️  .env 파일은 절대 다른 사람과 공유하지 마세요.
⚠️  API 키가 포함된 .env 파일을 이메일로 보내지 마세요.
⚠️  .gitignore에 .env가 포함되어 있어 Git에 올라가지 않습니다.
✅  .env.sample 파일은 공유 가능합니다. (API 키 없음)
```

---

## 📞 문의

문제 발생 시 아래 정보를 함께 제공해주세요:
1. 오류 메시지 전체
2. 터미널 출력 내용
3. 사용 중인 Node.js 버전 (node --version)
