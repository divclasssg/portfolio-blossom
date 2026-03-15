'use client';

import { createContext, useContext, useState } from 'react';

const PatientDataModalContext = createContext(null);

export function PatientDataModalProvider({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('symptoms');

    return (
        <PatientDataModalContext.Provider
            value={{
                isOpen,
                activeTab,
                setActiveTab,
                open: (tab) => {
                    setActiveTab(typeof tab === 'string' ? tab : 'symptoms');
                    setIsOpen(true);
                },
                close: () => setIsOpen(false),
            }}
        >
            {children}
        </PatientDataModalContext.Provider>
    );
}

export function usePatientDataModal() {
    const ctx = useContext(PatientDataModalContext);
    if (!ctx)
        throw new Error('usePatientDataModal은 PatientDataModalProvider 안에서 사용해야 합니다.');
    return ctx;
}
