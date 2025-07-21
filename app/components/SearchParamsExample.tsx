'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useState, useCallback } from 'react'

export default function SearchParamsExample() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    
    const [inputValue, setInputValue] = useState('')

    // 1. 기본 사용법 - URL 파라미터 읽기
    const category = searchParams.get('category')
    const page = searchParams.get('page')
    const search = searchParams.get('search')
    const filters = searchParams.getAll('filter') // 여러 개 값

    // 2. 모든 파라미터를 객체로 변환
    const allParams = Object.fromEntries(searchParams.entries())

    // 3. URL 파라미터 업데이트 함수
    const updateSearchParams = useCallback((key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        
        router.push(`${pathname}?${params.toString()}`)
    }, [searchParams, router, pathname])

    // 4. 여러 파라미터 동시 업데이트
    const updateMultipleParams = useCallback((updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        })
        
        router.push(`${pathname}?${params.toString()}`)
    }, [searchParams, router, pathname])

    // 5. 모든 파라미터 삭제
    const clearAllParams = () => {
        router.push(pathname)
    }

    // 6. 특정 파라미터만 유지하고 나머지 삭제
    const keepOnlyParams = (keysToKeep: string[]) => {
        const params = new URLSearchParams()
        
        keysToKeep.forEach(key => {
            const value = searchParams.get(key)
            if (value) {
                params.set(key, value)
            }
        })
        
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>📋 useSearchParams 사용법</h2>
            
            {/* 현재 URL 정보 */}
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                fontFamily: 'monospace'
            }}>
                <h3>🔗 현재 URL 정보</h3>
                <p><strong>경로:</strong> {pathname}</p>
                <p><strong>쿼리 문자열:</strong> {searchParams.toString() || '(없음)'}</p>
                <p><strong>전체 URL:</strong> {pathname}?{searchParams.toString()}</p>
            </div>

            {/* 개별 파라미터 값 */}
            <div style={{ marginBottom: '20px' }}>
                <h3>📊 개별 파라미터 값</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div style={{ padding: '10px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
                        <strong>category:</strong> {category || '(없음)'}
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
                        <strong>page:</strong> {page || '(없음)'}
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
                        <strong>search:</strong> {search || '(없음)'}
                    </div>
                    <div style={{ padding: '10px', backgroundColor: '#fce4ec', borderRadius: '4px' }}>
                        <strong>filters:</strong> {filters.length > 0 ? filters.join(', ') : '(없음)'}
                    </div>
                </div>
            </div>

            {/* 모든 파라미터 객체 */}
            <div style={{ marginBottom: '20px' }}>
                <h3>🗂️ 모든 파라미터 (객체형태)</h3>
                <pre style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px', 
                    borderRadius: '4px',
                    fontSize: '14px',
                    overflow: 'auto'
                }}>
                    {JSON.stringify(allParams, null, 2)}
                </pre>
            </div>

            {/* 파라미터 조작 버튼들 */}
            <div style={{ marginBottom: '20px' }}>
                <h3>🎮 파라미터 조작</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                    <button
                        onClick={() => updateSearchParams('category', '음악')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        category=음악
                    </button>
                    
                    <button
                        onClick={() => updateSearchParams('page', '2')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        page=2
                    </button>
                    
                    <button
                        onClick={() => updateSearchParams('search', '서울')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        search=서울
                    </button>
                    
                    <button
                        onClick={() => updateMultipleParams({
                            category: '전시',
                            page: '1',
                            search: '강남'
                        })}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        복합 설정
                    </button>
                </div>

                {/* 커스텀 파라미터 입력 */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                    <input
                        type="text"
                        placeholder="키=값 (예: sort=date)"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        style={{
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            flex: 1
                        }}
                    />
                    <button
                        onClick={() => {
                            const [key, value] = inputValue.split('=')
                            if (key && value) {
                                updateSearchParams(key.trim(), value.trim())
                                setInputValue('')
                            }
                        }}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#fd7e14',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        추가
                    </button>
                </div>

                {/* 클리어 버튼들 */}
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => updateSearchParams('category', '')}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        category 삭제
                    </button>
                    
                    <button
                        onClick={() => keepOnlyParams(['search'])}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        search만 유지
                    </button>
                    
                    <button
                        onClick={clearAllParams}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#343a40',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        모두 삭제
                    </button>
                </div>
            </div>

            {/* 코드 예시 */}
            <div style={{ marginTop: '30px' }}>
                <h3>💻 코드 예시</h3>
                <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '15px', 
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'monospace'
                }}>
                    <h4>1. 기본 사용법</h4>
                    <pre>{`const searchParams = useSearchParams()
const category = searchParams.get('category') // 단일 값
const filters = searchParams.getAll('filter') // 배열 값`}</pre>
                    
                    <h4>2. 파라미터 업데이트</h4>
                    <pre>{`const params = new URLSearchParams(searchParams.toString())
params.set('category', '음악')
router.push(\`\${pathname}?\${params.toString()}\`)`}</pre>
                    
                    <h4>3. 조건부 처리</h4>
                    <pre>{`const page = parseInt(searchParams.get('page') || '1')
const hasSearch = searchParams.has('search')
const isEmpty = searchParams.toString() === ''`}</pre>
                </div>
            </div>
        </div>
    )
} 