'use client';

import { createContext, useContext, useRef } from 'react';

const ResultEditContext = createContext(null);

// 편집값 공유 Provider — ref 기반이므로 입력 시 리렌더 없음
export function ResultEditProvider({ children }) {
    const editRef = useRef({});
    return (
        <ResultEditContext.Provider value={editRef}>
            {children}
        </ResultEditContext.Provider>
    );
}

export function useResultEdit() {
    return useContext(ResultEditContext);
}
