import { toPng } from 'html-to-image';
import { Settings, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';

import DeathNotice, { DeathNoticeT } from '@/components/deathnotice';
import SettingsDialog from '@/components/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import WeaponSelection from '@/components/weapon-selection';
import { DEFAULT_COLORS, MAPS } from '@/consts';
import { useLocalStorage } from '@/hooks';
import { cn } from '@/lib/utils';

interface NameInputProps {
	placeholder: string;
	value: string;
	side: 'CT' | 'T';
	setInputValue: (value: string) => void;
	setSide: (side: 'CT' | 'T') => void;
}

function NameInput({ placeholder, value, side, setInputValue, setSide }: NameInputProps) {
	return (
		<div className='flex gap-2'>
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
	const [deathnotices, setDeathnotices] = useState<DeathNoticeT[]>([]);
	const [currentEntry, setCurrentEntry] = useState<DeathNoticeT>(initialEntryState);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [map, setMap] = useLocalStorage<(typeof MAPS)[number]>('map', 'de_mirage');
	const [currentColors, setCurrentColors] = useLocalStorage('colors', DEFAULT_COLORS);

	const ref = useRef<HTMLDivElement>(null);
	const scale = 1;
	const exportKillfeed = () => {
		if (!ref.current) return;
		toPng(ref.current, {
			cacheBust: true,
			pixelRatio: scale > 1 ? scale : 1
		})
			.then((dataUrl) => {
				const link = document.createElement('a');
				link.download = 'killfeed.png';
				link.href = dataUrl;
				link.click();
			})
			.catch((err) => console.error(err));
	};

	return (
		<div className='p-4 min-[1400px]:px-32'>
			<div className='flex w-full items-end justify-between pb-4'>
				<h1 className='text-2xl font-bold max-[500px]:absolute max-[500px]:opacity-0'>
					CS2 Killfeed Generator
				</h1>
				<Select value={map} onValueChange={(v) => setMap(v as (typeof MAPS)[number])}>
					<SelectTrigger className='w-48 max-[500px]:ml-auto'>
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
						setColors={setCurrentColors}
					/>
				) : (
					<div className='w-full space-y-4 duration-300 animate-in fade-in-50 slide-in-from-left-1/2 md:max-lg:relative md:max-lg:flex md:max-lg:items-start md:max-lg:gap-4 lg:w-1/3'>
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
								variant={currentEntry.headshot ? 'default' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, headshot: !prev.headshot }))}
							>
								Headshot
							</Button>
							<Button
								variant={currentEntry.penetrate ? 'default' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, penetrate: !prev.penetrate }))}
							>
								Wallbang
							</Button>
							<Button
								variant={currentEntry.noscope ? 'default' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, noscope: !prev.noscope }))}
							>
								Noscope
							</Button>
							<Button
								variant={currentEntry.smoke ? 'default' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, smoke: !prev.smoke }))}
							>
								Through Smoke
							</Button>
							<Button
								variant={currentEntry.inair ? 'default' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, inair: !prev.inair }))}
							>
								In Air
							</Button>
							<Button
								variant={currentEntry.blind ? 'default' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, blind: !prev.blind }))}
							>
								Blind
							</Button>
							<Button
								variant={currentEntry.flashAssist ? 'default' : 'outline'}
								onClick={() => setCurrentEntry((prev) => ({ ...prev, flashAssist: !prev.flashAssist }))}
							>
								Flash Assist
							</Button>
							<Button
								variant={currentEntry.isLocal ? 'default' : 'outline'}
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
							<Button size='icon' variant='outline' onClick={() => setSettingsOpen(true)}>
								<Settings size='1.25rem' />
							</Button>
						</div>
					</div>
				)}

				<div className='min-h-96 w-full space-y-4 max-lg:space-y-0 lg:w-2/3'>
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
							Remove all
						</Button>
						<div className='z-[1] flex select-none flex-col items-end leading-5' ref={ref}>
							{deathnotices.length > 0 &&
								deathnotices.map((dn, i) => {
									return (
										<div key={`dn-${i}`} className='flex items-center gap-2'>
											<Button
												variant='destructive'
												className='mt-1.5 size-[1.85rem] rounded-sm opacity-0 transition-all focus:opacity-100 group-hover:opacity-100'
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
