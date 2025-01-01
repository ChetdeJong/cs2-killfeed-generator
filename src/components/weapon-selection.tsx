import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WEAPONS } from '@/consts';
import { cn } from '@/lib/utils';

interface WeaponSelectionProps {
	value: string;
	setValue: (weapon: string) => void;
}

export default function WeaponSelection({ value, setValue }: WeaponSelectionProps) {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button role='combobox' aria-expanded={open} className='w-full justify-between hover:bg-primary'>
					{WEAPONS[value as keyof typeof WEAPONS] || 'Select weapon...'}
					<ChevronsUpDown size='1.25rem' className='opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[var(--radix-popover-trigger-width)] p-0'>
				<Command>
					<CommandInput spellCheck={false} placeholder='Search weapon...' />
					<CommandList>
						<CommandEmpty>Not found.</CommandEmpty>
						<CommandGroup>
							<ScrollArea className='h-48'>
								{Object.entries(WEAPONS).map(([key, displayName]) => (
									<CommandItem
										key={key}
										value={key}
										className='relative pl-8'
										onSelect={(currentValue) => {
											setValue(currentValue === value ? '' : currentValue);
											setOpen(false);
										}}
									>
										{displayName}
										<Check
											className={cn(
												'absolute left-2',
												value === key ? 'opacity-100' : 'opacity-0'
											)}
										/>
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
