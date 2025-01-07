import '@/index.css';

import posthog, { PostHogConfig } from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import KillfeedGenerator from '@/app/page';

const posthogOptions: Partial<PostHogConfig> = {
	api_host: import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_HOST,
	capture_pageleave: true,
	capture_pageview: true,
	autocapture: false,
	disable_session_recording: true,
	loaded: (p) => {
		window.onerror = (error, line, col) => p.capture('clientError', { error, line, col });
	}
};

if (import.meta.env.MODE !== 'development')
	posthog.init(import.meta.env.VITE_REACT_APP_PUBLIC_POSTHOG_KEY, posthogOptions);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<PostHogProvider client={posthog}>
			<KillfeedGenerator />
		</PostHogProvider>
	</StrictMode>
);
