import { FileInput } from 'lucide-react';
import posthog from 'posthog-js';
import { useEffect, useState } from 'react';

import { DeathNoticeT } from '@/components/deathnotice';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WEAPONS } from '@/consts';

const weaponsList = new Map(Object.entries(WEAPONS));

const getDeathnotices = (data: string): DeathNoticeT[] => {
	const result: DeathNoticeT[] = [];
	const rows = data.split('\n').filter((row) => row.trim() !== '');
	const match = data.match(/,|\t/);
	const delim = match ? match[0] : null;
	if (!delim) return result;

	for (const row of rows) {
		const values = row.split(delim);

		if (values.length !== 15) continue;
		if (values[0] === '' || values[1] === '' || values[2] === '' || values[3] === '') continue;
		if (!weaponsList.has(values[6])) continue;

		result.push({
			attackerSide: values[0].toLowerCase() === 'ct' ? 'CT' : 'T',
			attacker: values[1],
			victimSide: values[2].toLowerCase() === 'ct' ? 'CT' : 'T',
			victim: values[3],
			assisterSide: values[4].toLowerCase() === 'ct' ? 'CT' : 'T',
			assister: values[5],
			weapon: values[6],
			headshot: values[7].toLowerCase() === 'true',
			penetrate: values[8].toLowerCase() === 'true',
			noscope: values[9].toLowerCase() === 'true',
			smoke: values[10].toLowerCase() === 'true',
			inair: values[11].toLowerCase() === 'true',
			blind: values[12].toLowerCase() === 'true',
			flashAssist: values[13].toLowerCase() === 'true',
			isLocal: values[14].toLowerCase() === 'true'
		});
	}

	return result;
};
interface ImportPopupProps {
	setDeathnotices: (deathnotices: DeathNoticeT[]) => void;
}

export default function ImportPopup({ setDeathnotices }: ImportPopupProps) {
	const [open, setOpen] = useState(false);
	const [isLgQuery, setIsLgQuery] = useState(false);

	useEffect(() => {
		const handlePaste = (e: ClipboardEvent) => {
			const data = e.clipboardData?.getData('Text');
			if (!data) return;
			const deathnotices = getDeathnotices(data);
			if (deathnotices.length === 0) return;
			setOpen(false);
			setDeathnotices(deathnotices);
			posthog.capture('import_from_clipboard');
		};
		if (open) {
			document.addEventListener('paste', handlePaste);
		} else {
			document.removeEventListener('paste', handlePaste);
		}

		return () => {
			document.removeEventListener('paste', handlePaste);
		};
	}, [open, setDeathnotices]);

	useEffect(() => {
		const mediaQuery = window.matchMedia('(min-width: 1024px)');

		const handleMediaQueryChange = (event: MediaQueryListEvent) => {
			setIsLgQuery(event.matches);
		};

		setIsLgQuery(mediaQuery.matches);

		mediaQuery.addEventListener('change', handleMediaQueryChange);
		return () => {
			mediaQuery.removeEventListener('change', handleMediaQueryChange);
		};
	}, []);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button size='icon' variant='secondary'>
					<FileInput size='1.25rem' />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				className='w-[calc(var(--radix-popover-content-available-width)-1.5rem)]'
				side={isLgQuery ? 'right' : 'left'}
			>
				<div className='space-y-2'>
					<h3 className='pb-2 text-lg font-bold leading-none tracking-wider'>Import from clipboard</h3>
					<p>Paste here tab or comma separated data in following format:</p>
					<p className='break-words'>
						AttackerSide,AttackerName,VictimSide,VictimName,AssisterSide,AssisterName,Weapon,Headshot,Wallbang,Noscope,Smoke,Blind,InAir,FlashAssist,RedBorder
					</p>
					<p>
						Assister is optional and can be empty. Sides are T or CT. Properties are TRUE or FALSE. Each
						deathnotice is separated with new line.
					</p>
					<p>
						<a
							href='https://github.com/ChetdeJong/cs2-killfeed-generator/blob/master/public/weapons-list.txt'
							className='text-primary-foreground underline-offset-4 hover:underline'
							target='_blank'
							rel='noreferrer'
						>
							Click here to see weapons list.
						</a>
					</p>
					<p>
						<a
							href='https://github.com/ChetdeJong/cs2-killfeed-generator/blob/master/public/import-example.txt'
							className='text-primary-foreground underline-offset-4 hover:underline'
							target='_blank'
							rel='noreferrer'
						>
							Click here to see example.
						</a>
					</p>
				</div>
			</PopoverContent>
		</Popover>
	);
}
