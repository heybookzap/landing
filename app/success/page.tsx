'use client'



import { useEffect, useState, Suspense } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { supabase } from '@/lib/supabase'



function SuccessContent() {

  const router = useRouter()

  const searchParams = useSearchParams()

  const [status, setStatus] = useState('결제를 확인하고 있습니다...')



  useEffect(() => {

    const processPaymentAndAuth = async () => {

      const paymentKey = searchParams.get('paymentKey')

      const orderId = searchParams.get('orderId')

      const amount = searchParams.get('amount')



      if (!paymentKey || !orderId || !amount) {

        router.push('/pricing')

        return

      }



      setStatus('당신만의 전용 공간을 만들고 있습니다...')



      const email = localStorage.getItem('vvip_email') || `vvip_${Date.now()}@oneblank.com`

      const tempPassword = Math.random().toString(36).slice(-10) + 'Vv1!'



      try {

        const { data: authData, error: authError } = await supabase.auth.signUp({

          email,

          password: tempPassword,

        })



        if (authError || !authData.user) throw authError



        setStatus('보호 시스템을 켜는 중입니다...')



        await supabase.from('users').upsert([

          { id: authData.user.id, email: email, name: 'VVIP Client' }

        ])



        await supabase.from('subscriptions').insert([

          {

            user_id: authData.user.id,

            plan_type: 'CORE_ANNUAL',

            status: 'ACTIVE',

            current_period_start: new Date().toISOString(),

            current_period_end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()

          }

        ])



        setStatus('준비가 모두 끝났습니다. 이동합니다.')

        setTimeout(() => {

          router.push('/dashboard/setup')

        }, 1500)



      } catch (error) {

        setStatus('문제가 발생했습니다. 관리자에게 알려주세요.')

      }

    }



    processPaymentAndAuth()

  }, [searchParams, router])



  return (

    <div className="text-center space-y-8 animate-in fade-in duration-1000">

      <div className="w-12 h-12 border-2 border-[#C2A35D] border-t-transparent rounded-full animate-spin mx-auto"></div>

      <h1 className="text-2xl font-light tracking-widest text-[#C2A35D]">{status}</h1>

      <p className="text-zinc-500 text-sm font-light">창을 닫지 마세요. 3초 정도 걸립니다.</p>

    </div>

  )

}



export default function CheckoutSuccessPage() {

  return (

    <main className="flex-1 flex items-center justify-center min-h-screen bg-[#050505] text-white">

      <Suspense fallback={<div className="text-[#C2A35D] text-center">불러오는 중...</div>}>

        <SuccessContent />

      </Suspense>

    </main>

  )

}
