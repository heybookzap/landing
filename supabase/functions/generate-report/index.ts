import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { user_id, condition } = await req.json()
  
  const authHeader = req.headers.get('Authorization')!
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  // 1. 대표님의 목표 정보 가져오기
  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('goal, hourly_rate')
    .eq('id', user_id)
    .single()

  // 2. 클로드(Claude)에게 지침 생성 요청
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022', // 가장 똑똑한 최신 클로드 모델
      max_tokens: 300,
      system: '당신은 상위 0.1% 창업가를 위한 냉철한 비서실장입니다. 말투는 차갑고 단호하며, 초등학생도 이해할 수 있는 쉬운 단어만 사용합니다. 반드시 알려준 JSON 형태로만 대답하고 다른 말은 절대 덧붙이지 마세요.',
      messages: [
        { 
          role: 'user', 
          content: `목표: ${profile?.goal || '성공'}, 컨디션: ${condition}. 오늘 당장 해야 할 딱 한 가지 행동과 그 결과를 3줄로 요약해서 JSON 형식으로 답하세요. 양식: { "instruction": "오늘 할 일", "o": "이대로 하면 얻는 것", "x": "안 하고 미루면 잃는 것" }` 
        }
      ],
    }),
  })

  const aiData = await response.json()
  const contentString = aiData.content[0].text
  const content = JSON.parse(contentString)

  // 3. 생성된 지침을 DB에 저장
  const { data, error } = await supabaseClient
    .from('daily_reports')
    .insert([
      { 
        user_id, 
        instruction: content.instruction, 
        result_o: content.o, 
        result_x: content.x 
      }
    ])

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } })
})
