import '@/index.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import KillfeedGenerator from '@/app/page';
import { TooltipProvider } from '@/components/ui/tooltip';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<TooltipProvider delayDuration={200}>
			<KillfeedGenerator />
		</TooltipProvider>
	</StrictMode>
);
