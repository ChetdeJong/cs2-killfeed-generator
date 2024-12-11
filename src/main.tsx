import '@/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import KillfeedGenerator from '@/app/page';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<KillfeedGenerator />
	</StrictMode>
);
