import { toPng } from 'html-to-image';
import { ExternalLink, Settings, Trash2 } from 'lucide-react';
import posthog from 'posthog-js';
import { startTransition, useRef, useState } from 'react';

import DeathNotice, { Colors, DeathNoticeT } from '@/components/deathnotice';
import ImportPopup from '@/components/import-popup';
import SettingsDialog from '@/components/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WeaponSelection from '@/components/weapon-selection';
import { DEFAULT_COLORS, DEFAULT_RESOLUTION, MAPS } from '@/consts';
import { useLocalStorage } from '@/hooks';
import { cn } from '@/lib/utils';

interface NameInputProps extends React.HTMLAttributes<HTMLDivElement> {
	placeholder: string;
	value: string;
	side: 'CT' | 'T';
	setInputValue: (value: string) => void;
	setSide: (side: 'CT' | 'T') => void;
}

function NameInput({ placeholder, value, side, setInputValue, setSide, className }: NameInputProps) {
	return (
		<div className={cn('flex gap-2', className)}>
			<Input
				spellCheck={false}
				value={value}
				placeholder={placeholder}
				className='flex-grow'
				onChange={(ev) => setInputValue(ev.target.value)}
			/>
			<div className='inline-flex h-10 items-center justify-center rounded-md border bg-primary/30 text-muted-foreground'>
				<button
					className={cn(
						'inline-flex h-full w-10 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
						side === 'CT' && 'rounded-l-sm bg-primary text-foreground shadow-sm'
					)}
					onClick={() => setSide('CT')}
				>
					CT
				</button>
				<button
					className={cn(
						'inline-flex h-full w-10 items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
						side === 'T' && 'rounded-r-sm bg-primary text-foreground shadow-sm'
					)}
					onClick={() => setSide('T')}
				>
					T
				</button>
			</div>
		</div>
	);
}

const initialEntryState: DeathNoticeT = {
	attacker: '',
	victim: '',
	weapon: '',
	attackerSide: 'CT',
	victimSide: 'T',
	blind: false,
	noscope: false,
	smoke: false,
	penetrate: false,
	headshot: false,
	inair: false,
	assister: '',
	assisterSide: 'CT',
	flashAssist: false,
	isLocal: false
};

export default function KillfeedGenerator() {
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [currentEntry, setCurrentEntry] = useState<DeathNoticeT>(initialEntryState);
	const [deathnotices, setDeathnotices] = useLocalStorage<DeathNoticeT[]>('deathnotices', []);
	const [map, setMap] = useLocalStorage<(typeof MAPS)[number]>('map', 'de_mirage');
	const [currentColors, setCurrentColors] = useLocalStorage('colors', DEFAULT_COLORS);
	const params = new URLSearchParams(window.location.search);
	const RESOLUTION = {
		width: parseInt(params.get('w') ?? `${DEFAULT_RESOLUTION.width}`),
		height: parseInt(params.get('h') ?? `${DEFAULT_RESOLUTION.height}`)
	};
	const [resolution, setResolution] = useLocalStorage('resolution', RESOLUTION);

	const transitionColors = (value: Colors | ((prevValue: Colors) => Colors)) => {
		startTransition(() => {
			setCurrentColors(value);
		});
	};

	const ref = useRef<HTMLDivElement>(null);
	const scale = resolution.height / 1080;
	const exportKillfeed = async () => {
		if (!ref.current) return;
		const link = document.createElement('a');
		ref.current.style.display = 'block';

		// workaround, so it renders correctly on mobile
		if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
			await toPng(ref.current, {
				cacheBust: true,
				pixelRatio: 1
			});
		}

		toPng(ref.current, {
			fetchRequestInit: {
				mode: 'cors',
				credentials: 'omit',
				cache: 'no-cache'
			},
			cacheBust: true,
			pixelRatio: 1
		})
			.then((dataUrl) => {
				link.download = `killfeed_${resolution.width}x${resolution.height}.png`;
				link.href = dataUrl;
				link.click();
				posthog.capture('export_killfeed');
			})
			.catch((err) => console.error(err))
			.finally(() => {
				link.remove();
				if (!ref.current) return;
				ref.current.style.display = 'none';
			});
	};

	return (
		<div className='p-4 transition-all min-[1400px]:px-32 min-[1600px]:px-44'>
			<div
				ref={ref}
				className='absolute left-0 top-0 z-[-1] bg-transparent'
				style={{ width: resolution.width, height: resolution.height, display: 'none' }}
			>
				<div
					className='flex flex-col items-end pr-2 pt-16'
					style={{
						transform: `scale(${scale > 1 ? scale : 1})`,
						transformOrigin: 'top right'
					}}
				>
					{deathnotices.length > 0 &&
						deathnotices.map((dn, i) => {
							return <DeathNotice key={`dn-hidden-${i}`} deathnoticeData={dn} colors={currentColors} />;
						})}
				</div>
			</div>

			<div className='flex w-full items-end justify-between pb-4'>
				<div className='flex items-center gap-2'>
					<h1 className='text-nowrap text-2xl font-bold max-[670px]:absolute max-[670px]:z-[-1] max-[670px]:opacity-0'>
						CS2 Killfeed Generator
					</h1>
					<Button
						className='size-10 rounded-full hover:bg-white/10'
						variant='ghost'
						size='icon'
						onClick={() => window.open('https://github.com/ChetdeJong/cs2-killfeed-generator')}
					>
						<img src='/github-icon.svg' className='size-6'></img>
					</Button>
					<Button
						variant={'link'}
						className='px-0 underline'
						onClick={() => window.open('https://youtu.be/RT8CdiAPt6o')}
					>
						Learn how to use
						<ExternalLink size='1rem' />
					</Button>
				</div>
				<Select value={map} onValueChange={(v) => setMap(v as (typeof MAPS)[number])}>
					<SelectTrigger className='w-48 max-[520px]:ml-auto'>
						<SelectValue placeholder='Select background' />
					</SelectTrigger>
					<SelectContent>
						{MAPS.map((m, i) => (
							<SelectItem key={i} value={m}>
								{m}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className='flex w-full flex-col gap-4 lg:flex-row'>
				{settingsOpen ? (
					<SettingsDialog
						open={settingsOpen}
						setOpen={setSettingsOpen}
						colors={currentColors}
						setColors={transitionColors}
						resolution={resolution}
						setResolution={setResolution}
					/>
				) : (
					<div className='w-full space-y-4 duration-300 animate-in fade-in-50 slide-in-from-left-10 md:max-lg:relative md:max-lg:flex md:max-lg:items-start md:max-lg:gap-4 lg:w-1/3'>
						<div className='contents space-y-4 md:max-lg:flex md:max-lg:w-1/2 md:max-lg:flex-col lg:contents'>
							<NameInput
								placeholder='Killer name'
								value={currentEntry.attacker}
								side={currentEntry.attackerSide}
								setInputValue={(v) => setCurrentEntry((prev) => ({ ...prev, attacker: v }))}
								setSide={(v) => setCurrentEntry((prev) => ({ ...prev, attackerSide: v }))}
							/>
							<NameInput
								placeholder='Victim name'
								value={currentEntry.victim}
								side={currentEntry.victimSide}
								setInputValue={(v) => setCurrentEntry((prev) => ({ ...prev, victim: v }))}
								setSide={(v) => setCurrentEntry((prev) => ({ ...prev, victimSide: v }))}
							/>
							<NameInput
								placeholder='Assister name (optional)'
								value={currentEntry.assister || ''}
								side={currentEntry.assisterSide || 'CT'}
								setInputValue={(v) => setCurrentEntry((prev) => ({ ...prev, assister: v }))}
								setSide={(v) => setCurrentEntry((prev) => ({ ...prev, assisterSide: v }))}
							/>
							<WeaponSelection
								value={currentEntry.weapon}
								setValue={(v) => setCurrentEntry((prev) => ({ ...prev, weapon: v }))}
							/>
						</div>
						<div className='grid grid-cols-3 gap-2 overflow-hidden md:max-lg:w-1/2'>
							<Button
								variant={currentEntry.headshot ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, headshot: !prev.headshot }))}
							>
								Headshot
							</Button>
							<Button
								variant={currentEntry.penetrate ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, penetrate: !prev.penetrate }))}
							>
								Wallbang
							</Button>
							<Button
								variant={currentEntry.noscope ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, noscope: !prev.noscope }))}
							>
								Noscope
							</Button>
							<Button
								variant={currentEntry.smoke ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, smoke: !prev.smoke }))}
							>
								Through Smoke
							</Button>
							<Button
								variant={currentEntry.inair ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, inair: !prev.inair }))}
							>
								In Air
							</Button>
							<Button
								variant={currentEntry.blind ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, blind: !prev.blind }))}
							>
								Blind
							</Button>
							<Button
								variant={currentEntry.flashAssist ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, flashAssist: !prev.flashAssist }))}
							>
								Flash Assist
							</Button>
							<Button
								variant={currentEntry.isLocal ? 'selected' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, isLocal: !prev.isLocal }))}
							>
								Red Border
							</Button>
						</div>
						<div className='flex items-center gap-2 md:max-lg:absolute md:max-lg:bottom-0 md:max-lg:right-0 md:max-lg:w-1/2 md:max-lg:pl-2'>
							<Button
								disabled={!(currentEntry.attacker && currentEntry.victim && currentEntry.weapon)}
								className='flex-grow'
								onClick={() => {
									if (currentEntry.attacker && currentEntry.victim && currentEntry.weapon) {
										setDeathnotices([...deathnotices, currentEntry]);
									}
								}}
							>
								Add entry
							</Button>
							<Button disabled={deathnotices.length === 0} onClick={exportKillfeed}>
								Export Killfeed
							</Button>
							<Button size='icon' variant='secondary' onClick={() => setSettingsOpen(true)}>
								<Settings size='1.25rem' />
							</Button>
							<ImportPopup setDeathnotices={setDeathnotices} />
						</div>
					</div>
				)}

				<div className='w-full space-y-4 max-lg:space-y-0 md:min-h-96 lg:w-2/3'>
					<div
						className='group relative flex h-full justify-between gap-4 overflow-hidden rounded-lg bg-cover p-4 pr-2 pt-4 brightness-90 contrast-[1.1] max-md:min-h-52 md:max-lg:min-h-96'
						style={{
							backgroundImage: `url(${new URL('/maps/' + map + '.jpg', import.meta.url).href})`
						}}
					>
						<Button
							variant='destructive'
							className='z-[1] opacity-0 transition-all focus:opacity-100 disabled:hidden group-hover:opacity-100'
							onClick={() => setDeathnotices([])}
							disabled={deathnotices.length === 0}
						>
							Clear
						</Button>
						<div className='z-[1] flex select-none flex-col items-end leading-5'>
							{deathnotices.length > 0 &&
								deathnotices.map((dn, i) => {
									return (
										<div key={`dn-${i}`} className='flex w-full items-center gap-2'>
											<Button
												variant='destructive'
												className='mr-auto mt-1.5 size-[1.85rem] rounded-sm opacity-0 transition-all focus:opacity-100 group-hover:opacity-100'
												onClick={() =>
													setDeathnotices((prev) => prev.filter((_, i2) => i2 !== i))
												}
											>
												<Trash2 size='1.1rem' />
											</Button>
											<DeathNotice
												deathnoticeData={dn}
												className='backdrop-blur animate-in fade-in'
												colors={currentColors}
											/>
										</div>
									);
								})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
