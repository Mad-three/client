'use client'
import { useSearchParams } from "next/navigation";
import { validateState } from "../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isValid, setIsValid] = useState(false);
  const code = searchParams.get('code') || '';
  const state = searchParams.get('state') || '';
  
  useEffect(() => {
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
          sessionStorage.setItem('token', token);
          sessionStorage.setItem('userId', user.userId);
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
  }, [router]);

  if (!isValid) {
    return <div>유효하지 않은 요청입니다.</div>;
  }

  return <div>로그인 중이에요...</div>;
}