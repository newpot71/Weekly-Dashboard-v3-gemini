// backend/utils/gemini-client.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

let client = null;

function getGeminiClient() {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY가 .env 파일에 설정되지 않았습니다.');
    }
    client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return client;
}

async function analyzeWithGemini(textContent) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  const SYSTEM_PROMPT = `
당신은 주간보고 문서를 분석하여 정해진 JSON 스키마만 출력하는 데이터 추출 전문 에이전트입니다.
출력은 반드시 JSON 코드 블록 하나만 출력하고, 앞뒤 설명을 붙이지 않습니다.

고정 팀 목록 (반드시 아래 7개 팀 모두 포함):
1. 프로젝트1팀
2. 프로젝트2팀
3. 프로젝트3팀
4. 프로젝트4팀
5. 프로젝트PM팀
6. 프로젝트제안팀
7. 프로젝트설계팀

출력 JSON 스키마:
{
  "reportDate": "YYYY-MM-DD",
  "weekNumber": "WXX",
  "executiveSummary": [
    "문장1: 전사 전반 성과 요약 (1문장)",
    "문장2: 주요 리스크 또는 주의 팀 언급 (1문장)",
    "문장3: 차주 핵심 액션 또는 기회 요약 (1문장)"
  ],
  "sharedIssues": [
    "여러 팀에서 공통으로 언급된 이슈 (없으면 빈 배열)"
  ],
  "teams": [
    {
      "teamName": "팀명",
      "kpi": "KPI 수치 (없으면 미기재)",
      "status": "정상 | 주의 | 위험",
      "summary": "팀 1줄 요약",
      "highlights": ["주요 성과 1", "주요 성과 2", "주요 성과 3"],
      "risks": ["리스크 1", "리스크 2"],
      "nextActions": ["차주 계획 1", "차주 계획 2"]
    }
  ]
}

status 판단 기준:
- 정상: 계획 대비 지연 없음, 리스크 경미
- 주의: 일정 지연 가능성 또는 의사결정 지연
- 위험: 수주 취소 가능성, PF 불확실, 중대 리스크

규칙:
1. 7개 팀 모두 반드시 포함 (데이터 없어도 미기재 처리)
2. 추측/계산/보정 금지 — 문서에 없는 내용은 미기재
3. 출력은 JSON 코드 블록 하나만 — 앞뒤 설명 없음
4. highlights, risks, nextActions는 각각 최대 5개 이내
5. executiveSummary는 반드시 3문장 정확히 출력
`;

  const prompt = `${SYSTEM_PROMPT}\n\n아래 주간보고 문서를 분석하여 JSON을 출력하세요:\n\n${textContent}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // JSON 추출 (```json ... ``` 블록에서)
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[1]);
  }

  // 코드 블록 없이 순수 JSON인 경우
  const plainMatch = text.match(/\{[\s\S]*\}/);
  if (plainMatch) {
    return JSON.parse(plainMatch[0]);
  }

  throw new Error('Gemini API가 올바른 JSON을 반환하지 않았습니다.');
}

module.exports = { analyzeWithGemini };
