import React, { Suspense } from 'react';
import ErrorClient from './ErrorClient';

export default function ErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      {/* ErrorClient is a client component that reads search params */}
      <ErrorClient />
    </Suspense>
  );
}