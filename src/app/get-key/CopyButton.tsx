'use client';

import React from 'react';

export default function CopyButton({ text }: { text: string }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        alert('Đã copy key vào bộ nhớ tạm!');
    };

    return (
        <button
            onClick={handleCopy}
            className="premium-button"
            style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
        >
            Copy Key
        </button>
    );
}
