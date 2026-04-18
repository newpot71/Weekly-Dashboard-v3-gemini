// backend/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ── 미들웨어 설정 ──────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── 프론트엔드 정적 파일 서비스 ───────────────────
app.use(express.static(path.join(__dirname, '../frontend')));

// ── API 라우터 ─────────────────────────────────────
const analyzeRouter = require('./routes/analyze');
app.use('/api/analyze', analyzeRouter);

// ── 기본 라우트 (프론트엔드 index.html 반환) ───────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── 에러 핸들러 ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[서버 오류]', err.message);
  res.status(500).json({ success: false, error: err.message });
});

// ── 서버 시작 ──────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('========================================');
  console.log('  프로젝트영업담당 주간보고 대시보드');
  console.log('========================================');
  console.log(`  서버 주소: http://localhost:${PORT}`);
  console.log(`  Gemini API: ${process.env.GEMINI_API_KEY ? '✅ 설정됨' : '❌ .env 파일 확인 필요'}`);
  console.log('========================================');
  console.log('');
});
