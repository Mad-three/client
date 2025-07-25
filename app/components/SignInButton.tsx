'use client'

import { PiSignInBold } from "react-icons/pi";
import styles from "./SignInButton.module.css";
import { generateSecureState } from "../utils/auth";

export default function SignInButton() {

  const clientURL = process.env.NEXT_PUBLIC_CLIENT_URL;

  const handleSignIn = () => {
    const state = generateSecureState();
    window.sessionStorage.setItem('state', state);

    const redirectUri = `${clientURL}/auth`;
    const clientId = process.env.NEXT_PUBLIC_NAVER_AUTH_CLIENT_ID || '';
    const responseType = 'code';

    const url = new URL('https://nid.naver.com/oauth2.0/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', responseType);
    url.searchParams.set('state', state);
    window.location.href = url.toString();
  }

  return (
    <button 
      className={styles.signInButton} 
      onClick={() => handleSignIn()}
      title="로그인">
      <PiSignInBold />
    </button>
  )
}