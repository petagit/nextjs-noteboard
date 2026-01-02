'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';

interface PasswordLockProps {
    onUnlock: () => void;
    correctPassword?: string;
}

export default function PasswordLock({ onUnlock, correctPassword = '1234' }: PasswordLockProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === correctPassword) {
            localStorage.setItem('hash_page_unlocked', 'true');
            onUnlock();
        } else {
            setError('Incorrect password. Please try again.');
            setPassword('');
        }
    };

    useEffect(() => {
        const isUnlocked = localStorage.getItem('hash_page_unlocked');
        if (isUnlocked === 'true') {
            onUnlock();
        }
    }, [onUnlock]);

    return (
        <div className="fixed inset-0 bg-white z-[100] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-10 h-10 text-orange-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">Protected Area</h1>
                <p className="text-gray-600 mb-8">This page is password protected. Please enter the password to continue.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter password..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-lg"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm animate-in slide-in-from-top-1">{error}</p>
                    )}

                    <Button
                        type="submit"
                        variant="orange"
                        className="w-full py-6 text-lg rounded-xl shadow-lg shadow-orange-200 transition-all hover:scale-[1.02]"
                    >
                        Unlock Access
                    </Button>
                </form>

                <p className="mt-8 text-xs text-gray-400 uppercase tracking-widest">Secure Noteboard System</p>
            </div>
        </div>
    );
}
