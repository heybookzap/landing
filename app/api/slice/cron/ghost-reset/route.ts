import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    // 보안 헤더 확인
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 어제의 미수행 과업(PENDING)을 고스트 리셋(GHOST_RESET) 처리
    const { error } = await supabase
      .from('daily_reports')
      .update({ status: 'GHOST_RESET' })
      .eq('status', 'PENDING');

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Ghost Reset Success' 
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
