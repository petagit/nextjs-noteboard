'use client';

import React, { useState } from 'react';
import NoteApp from '@/components/NoteApp';
import PasswordLock from '@/components/PasswordLock';

export default function HashPage() {
    const [isUnlocked, setIsUnlocked] = useState(false);

    if (!isUnlocked) {
        return <PasswordLock onUnlock={() => setIsUnlocked(true)} />;
    }

    return <NoteApp type="hash" />;
}
