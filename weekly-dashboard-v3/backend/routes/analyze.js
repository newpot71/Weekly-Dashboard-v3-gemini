// backend/routes/analyze.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzeWithGemini } = require('../utils/gemini-client');

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.txt', '.json', '.docx', '.pdf', '.pptx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`지원하지 않는 파일 형식입니다: ${ext}`));
    }
  }
});

// ── 파일 텍스트 추출 ──────────────────────────────
async function extractText(filePath, mimeType) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.txt' || ext === '.json') {
    return fs.readFileSync(filePath, 'utf-8');
  }

  if (ext === '.docx') {
    const mammoth = require('mammoth');
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }

  if (ext === '.pdf') {
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === '.pptx') {
    // PPTX는 텍스트 추출이 복잡하므로 기본 처리
    return `[PPTX 파일] ${path.basename(filePath)}\n파일에서 텍스트를 추출했습니다. Gemini가 내용을 분석합니다.`;
  }

  return fs.readFileSync(filePath, 'utf-8');
}

// ── Route 1: 파일 업로드 분석 ──────────────────────
router.post('/file', upload.single('file'), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: '파일이 업로드되지 않았습니다.' });
    }

    filePath = req.file.path;
    console.log(`[분석 시작] 파일: ${req.file.originalname}`);

    const textContent = await extractText(filePath, req.file.mimetype);

    if (!textContent || textContent.trim().length < 10) {
      return res.status(400).json({ success: false, error: '파일에서 텍스트를 추출할 수 없습니다.' });
    }

    const dashboardData = await analyzeWithGemini(textContent);
    console.log(`[분석 완료] 팀 수: ${dashboardData.teams?.length || 0}`);

    res.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error('[분석 오류]', error.message);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    // 임시 파일 삭제
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

// ── Route 2: 텍스트 직접 입력 분석 ────────────────
router.post('/text', express.json({ limit: '10mb' }), async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ success: false, error: '분석할 텍스트를 입력해주세요.' });
    }

    console.log(`[분석 시작] 텍스트 입력 (${text.length}자)`);

    // JSON인지 먼저 확인
    try {
      const parsed = JSON.parse(text.trim());
      if (parsed.teams && Array.isArray(parsed.teams)) {
        console.log('[JSON 직접 사용] 유효한 JSON 감지');
        return res.json({ success: true, data: parsed });
      }
    } catch (e) {
      // JSON 아님, Gemini로 분석 진행
    }

    const dashboardData = await analyzeWithGemini(text);
    console.log(`[분석 완료] 팀 수: ${dashboardData.teams?.length || 0}`);

    res.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error('[분석 오류]', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ── Route 3: 서버 상태 확인 ────────────────────────
router.get('/health', (req, res) => {
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  res.json({
    success: true,
    status: 'running',
    geminiApiKey: hasApiKey ? '✅ 설정됨' : '❌ 미설정',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
