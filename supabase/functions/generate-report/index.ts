import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from "https://esm.sh/openai@4"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    })

    // 1. 활성 유료 고객 데이터 추출
    const { data: users, error: userError } = await supabaseClient
      .from('profiles')
      .select('id, hourly_rate, goals(content)')
      .eq('status', 'ACTIVE')

    if (userError) throw userError

    for (const user of users) {
      const goalContent = user.goals?.[0]?.content || "목표 미설정"
      
      // 2. 마스터 프롬프트 기반 AI 호출
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
              [Identity] 상위 0.1% 창업가를 위한 초냉철한 AI 비서실장 'ONE BLANK'
              [Tone & Manner] 80% Cold & Authoritative / 20% Motivational Validation (격조 있는 지지)
              [Constraints] 
              1. 모든 실행 카드는 2분 이내 초단위 액션. 
              2. 동사형 종결 (~하십시오). 
              3. 리스크-보상 트리 필수 포함 (시급 ₩${user.hourly_rate} 기준 계산).
              [Output Structure] 1. 단일 미션 / 2. 인지적 지지 / 3. 리스크 트리 / 4. 반증 질문
            `
          },
          {
            role: "user",
            content: `목표: ${goalContent}, 시급: ${user.hourly_rate}`
          }
        ],
        temperature: 0.7
      })

      const aiDraft = completion.choices[0].message.content

      // 3. 검수용 임시 테이블(pending_reports)에 저장
      await supabaseClient.from('pending_reports').insert({
        user_id: user.id,
        content_draft: aiDraft,
        status: 'PENDING_REVIEW'
      })
    }

    return new Response(JSON.stringify({ message: "Reports generated successfully" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
