import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { ScrollArea } from './ui/scroll-area';

const WEAPONS = {
	ak47: 'AK-47',
	aug: 'AUG',
	awp: 'AWP',
	bizon: 'PP-Bizon',
	cz75a: 'CZ75-Auto',
	deagle: 'Desert Eagle',
	elite: 'Dual Berettas',
	famas: 'FAMAS',
	fiveseven: 'Five-SeveN',
	g3sg1: 'G3SG1',
	galilar: 'Galil AR',
	glock: 'Glock-18',
	hkp2000: 'P2000',
	m249: 'M249',
	m4a1: 'M4A4',
	m4a1_silencer: 'M4A1-S',
	m4a1_silencer_off: 'M4A1-S No Silencer',
	mac10: 'MAC-10',
	mag7: 'MAG-7',
	mp5sd: 'MP5-SD',
	mp7: 'MP7',
	mp9: 'MP9',
	negev: 'Negev',
	nova: 'Nova',
	p90: 'P90',
	p250: 'P250',
	revolver: 'R8 Revolver',
	sawedoff: 'Sawed-Off',
	scar20: 'Scar20',
	sg556: 'SG 553',
	ssg08: 'SSG 08',
	tec9: 'Tec-9',
	ump45: 'UMP-45',
	usp_silencer: 'USP-S',
	usp_silencer_off: 'USP-S No Silencer',
	xm1014: 'XM1014',
	taser: 'Zeus x27',
	flashbang: 'Flashbang',
	smokegrenade: 'Smoke Grenade',
	hegrenade: 'HE Grenade',
	molotov: 'Molotov',
	decoy: 'Decoy Grenade',
	incgrenade: 'Incendiary Grenade',
	planted_c4: 'Explosion',
	inferno: 'Fire',
	knife: 'CT Knife',
	knife_t: 'T Knife',
	knifegg: 'Gold Knife',
	bayonet: 'Bayonet',
	knife_flip: 'Flip Knife',
	knife_gut: 'Gut Knife',
	knife_css: 'Classic Knife',
	knife_m9_bayonet: 'M9 Bayonet',
	knife_karambit: 'Karambit',
	knifet_actical: 'Huntsman Knife',
	knife_butterfly: 'Butterfly Knife',
	knife_falchion: 'Falchion Knife',
	knife_push: 'Shadow Daggers',
	knife_bowie: 'Bowie Knife',
	knife_cord: 'Paracord Knife',
	knife_canis: 'Survival Knife',
	knife_ursus: 'Ursus Knife',
	knife_gypsy_jackknife: 'Navaja Knife',
	knife_outdoor: 'Nomad Knife',
	knife_widowmaker: 'Talon Knife',
	knife_stiletto: 'Stiletto Knife',
	knife_skeleton: 'Skeleton Knife',
	knife_kukri: 'Kukri Knife'
};

interface WeaponSelectionProps {
	value: string;
	setValue: (weapon: string) => void;
}

export default function WeaponSelection({ value, setValue }: WeaponSelectionProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button role='combobox' aria-expanded={open} className='w-full justify-between'>
					{WEAPONS[value as keyof typeof WEAPONS] || 'Select weapon...'}
					<ChevronsUpDown className='opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-64 p-0'>
				<Command>
					<CommandInput placeholder='Search weapon...' />
					<CommandList>
						<CommandEmpty>Not found.</CommandEmpty>
						<CommandGroup>
							<ScrollArea className='h-[200px]'>
								{Object.entries(WEAPONS).map(([key, displayName]) => (
									<CommandItem
										key={key}
										value={key}
										onSelect={(currentValue) => {
											setValue(currentValue === value ? '' : currentValue);
											setOpen(false);
										}}
									>
										{displayName}
										<Check className={cn('ml-auto', value === key ? 'opacity-100' : 'opacity-0')} />
									</CommandItem>
								))}
							</ScrollArea>
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
