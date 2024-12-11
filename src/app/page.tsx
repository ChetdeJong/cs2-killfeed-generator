import { Trash2 } from 'lucide-react';
import { useState } from 'react';

import DeathNotice, { DeathNoticeT } from '@/components/deathnotice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import WeaponSelection from '@/components/weapon-selection';
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
				value={value}
				placeholder={placeholder}
				className='flex-grow'
				onChange={(ev) => setInputValue(ev.target.value)}
			/>
			<div className='inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground'>
				<button
					className={cn(
						'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
						side === 'CT' && 'bg-background text-foreground shadow-sm'
					)}
					onClick={() => setSide('CT')}
				>
					CT
				</button>
				<button
					className={cn(
						'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
						side === 'T' && 'bg-background text-foreground shadow-sm'
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

	return (
		<div className='mx-auto flex w-full flex-col gap-4 p-4 lg:flex-row'>
			<div className='w-full space-y-4 lg:w-1/3'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold'>CS2 Killfeed Generator</h1>
				</div>
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
				<div className='grid grid-cols-3 gap-2 overflow-hidden'>
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
						variant={currentEntry.isLocal ? 'default' : 'outline'}
						onClick={() => setCurrentEntry((prev) => ({ ...prev, isLocal: !prev.isLocal }))}
					>
						Red Border
					</Button>
					<Button
						variant={currentEntry.noscope ? 'default' : 'outline'}
						onClick={() => setCurrentEntry((prev) => ({ ...prev, noscope: !prev.noscope }))}
					>
						Noscope
					</Button>
					<Button
						variant={currentEntry.inair ? 'default' : 'outline'}
						onClick={() => setCurrentEntry((prev) => ({ ...prev, inair: !prev.inair }))}
					>
						In Air
					</Button>
					<Button
						variant={currentEntry.smoke ? 'default' : 'outline'}
						onClick={() => setCurrentEntry((prev) => ({ ...prev, smoke: !prev.smoke }))}
					>
						Through Smoke
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
				</div>
				<div className='flex items-center gap-2'>
					<Button
						className='w-full'
						onClick={() => {
							if (currentEntry.attacker && currentEntry.victim && currentEntry.weapon) {
								setDeathnotices([...deathnotices, currentEntry]);
							}
							console.log(currentEntry);
						}}
					>
						Add entry
					</Button>
					<Button className='w-full'>Export Killfeed</Button>
				</div>
			</div>
			<div className='w-full space-y-2 lg:w-2/3'>
				<div className='mb-2 flex items-center justify-end'>
					<Select>
						<SelectTrigger className='w-[180px]'>
							<SelectValue placeholder='Select background' />
						</SelectTrigger>
						<SelectContent></SelectContent>
					</Select>
				</div>
				<div className='group flex h-96 justify-between gap-4 rounded-lg bg-secondary pr-2 pt-4'>
					<Button
						variant='destructive'
						className='ml-4 opacity-0 transition-all disabled:opacity-0 group-hover:opacity-100 disabled:group-hover:opacity-50'
						onClick={() => setDeathnotices([])}
						disabled={deathnotices.length === 0}
					>
						Remove all
					</Button>
					<div className='flex select-none flex-col items-end leading-5'>
						{deathnotices.length > 0 &&
							deathnotices.map((dn, i) => {
								return (
									<div key={`dn-${i}`} className='flex items-center gap-2'>
										<Button
											variant='destructive'
											className='mt-1.5 size-[1.85rem] rounded-sm opacity-0 transition-all group-hover:opacity-100'
											onClick={() =>
												setDeathnotices((prev) => prev.filter((dn2, i2) => i2 !== i))
											}
										>
											<Trash2 size='1.1rem' />
										</Button>
										<DeathNotice deathnoticeData={dn} />
									</div>
								);
							})}
					</div>
				</div>
			</div>
		</div>
	);
}
