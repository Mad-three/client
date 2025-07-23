'use client'
import { useSearchParams } from "next/navigation";
import { validateState } from "../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// 동적 렌더링 설정
export const dynamic = 'force-dynamic';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const [code, setCode] = useState('');
  const [state, setState] = useState('');

  useEffect(() => {
    // searchParams를 useEffect 내에서 안전하게 처리
    setCode(searchParams.get('code') || '');
    setState(searchParams.get('state') || '');
  }, [searchParams]);
  
  useEffect(() => {
    // code와 state가 설정된 후에만 실행
    if (!code || !state) return;

    const originalState = sessionStorage.getItem('state') || '';
    sessionStorage.removeItem('state');
    console.log('originalState', originalState);

    if (!validateState(state, originalState)) {
      alert('Invalid state');
      router.replace('/');
      return;
    }

    setIsValid(true);

    const handleCallback = async () => {
    try {
        console.log(code, state);
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/naver/callback`, {
        method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({ code, state }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
      const data = await response.json();
      const token = data.token;
      const user = data.user;
        
      if (token && user) {
        window.sessionStorage.setItem('token', token);
        window.sessionStorage.setItem('userId', user.userId.toString());
        } else {
          throw new Error('Invalid response data');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
    router.replace('/');
    }
  }

    handleCallback();
  }, [router, code, state]);

  if (!isValid) {
    return <div>유효하지 않은 요청입니다.</div>;
  }

  return <div>로그인 중이에요...</div>;
}

export default function Auth() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AuthContent />
    </Suspense>
  );
}