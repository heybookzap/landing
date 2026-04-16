import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);

  // wage(시급) 데이터가 없으면 기본값 100,000원으로 세팅하여 에러 방지
  const task = body?.task;
  const wage = body?.wage || 100000;

  if (!task || typeof task !== 'string' || !task.trim()) {
    return NextResponse.json({ error: 'task_required' }, { status: 400 });
  }

  // 동적 프롬프트 생성 (유저의 시급을 AI에게 주입)
  const SYSTEM_PROMPT = `당신은 'ONE BLANK 2.0'의 핵심 엔진인 '자산 슬라이서'입니다.
유저의 거대한 과업을 초등학교 6학년도 즉시 실행할 수 있는 '2분짜리 기계적 동사' 단 하나로 쪼개십시오.

[시스템 변수]
- 유저의 1시간 가치(시급): ${wage}원

[절대 규칙]
1. "준비하기", "생각하기" 같은 모호한 단어는 절대 금지합니다. "크롬 창 열기", "특정 파일 클릭하기"처럼 손가락이 즉시 움직이는 물리적 행위여야 합니다.
2. 액션은 반드시 '~하십시오.' 형태의 단호한 명령조로 끝내십시오.
3. 이 2분짜리 행동을 통해 유저가 낭비될 뻔한 시간을 아껴, 궁극적으로 방어해낸 자산 가치(원)를 계산하여 한 문장으로 뱉으십시오. (예: "이 2분의 딥워크를 통해 당신은 오늘 증발할 뻔한 X원을 방어했습니다.")
4. 출력은 반드시 아래 JSON 형식만 반환하십시오. 다른 인사말이나 텍스트는 절대 포함하지 마십시오.

{"action":"<동사로 시작하는 2분짜리 물리적 행동>","contribution":"<자산 방어 가치를 설명하는 한 문장>"}`;

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: task.trim() }],
    });

    const raw = (message.content[0] as { type: string; text: string }).text.trim();

    // JSON 추출 정규식 강화
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) {
      return NextResponse.json({ error: 'parse_failed', raw }, { status: 500 });
    }

    const parsed = JSON.parse(match[0]);

    // 프론트엔드가 요구하는 action, contribution 키 검증
    if (!parsed.action || !parsed.contribution) {
      return NextResponse.json({ error: 'invalid_fields', raw }, { status: 500 });
    }

    // 프론트엔드의 SliceSection.tsx와 완벽히 매칭되는 구조로 리턴
    return NextResponse.json({ action: parsed.action, contribution: parsed.contribution });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'unknown';
    return NextResponse.json({ error: 'api_failed', detail: errorMessage }, { status: 502 });
  }
}
