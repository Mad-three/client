import { useSearchParams } from "next/navigation";
import { validateState } from "../utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Auth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '';
  const originalState = sessionStorage.getItem('state') || '';

  if (!validateState(state, originalState)) {
    alert('Invalid state');
    router.replace('/');
  }

  const handleCallback = async () => {
    if (!validateState(state, originalState)) {
      alert('Invalid state');
      router.replace('/');
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/naver/callback`, {
        method: 'POST',
        body: JSON.stringify({ code, state }),
      })
      const data = await response.json();
      const token = data.token;
      const user = data.user;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', user.userId);
    } catch (error) {
      alert('Error');
    } finally {
    router.replace('/');
    }
  }

  useEffect(() => {
    handleCallback();
  }, []);

  return <div>로그인 중이에요...</div>;
}