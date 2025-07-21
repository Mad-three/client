/**
 * 네이버 로그인용 랜덤 state 생성 유틸리티 함수들
 */

/**
 * 암호학적으로 안전한 랜덤 state 생성 (권장)
 * 브라우저와 Node.js 환경 모두에서 작동
 * @param length - 생성할 문자열 길이 (기본값: 32)
 * @returns URL-safe한 랜덤 문자열
 */
export function generateSecureState(length: number = 32): string {
    // 브라우저 환경
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
        const array = new Uint8Array(length)
        window.crypto.getRandomValues(array)
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
    }
    
    // Fallback: Math.random 기반 (덜 안전하지만 호환성 좋음)
    return generateFallbackState(length)
}

/**
 * Fallback 랜덤 state 생성 (Math.random 기반)
 * 암호학적으로 안전하지 않으므로 최후의 수단으로만 사용
 * @param length - 생성할 문자열 길이
 * @returns 랜덤 문자열
 */
function generateFallbackState(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
}

/**
 * 네이버 로그인 URL 생성 헬퍼 함수
 * @param clientId - 네이버 애플리케이션 클라이언트 ID
 * @param redirectUri - 콜백 URL
 * @param state - 보안 state (미제공시 자동 생성)
 * @returns 네이버 로그인 URL과 state
 */
export function generateNaverLoginUrl(
    clientId: string,
    redirectUri: string,
    state?: string
): { url: string; state: string } {
    const generatedState = state || generateSecureState()
    
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        redirect_uri: redirectUri,
        state: generatedState
    })
    
    const url = `https://nid.naver.com/oauth2.0/authorize?${params.toString()}`
    
    return {
        url,
        state: generatedState
    }
}

/**
 * state 검증 함수
 * @param receivedState - 네이버에서 받은 state
 * @param originalState - 원래 생성한 state
 * @returns 검증 결과
 */
export function validateState(receivedState: string, originalState: string): boolean {
    return receivedState === originalState && receivedState.length >= 16
} 