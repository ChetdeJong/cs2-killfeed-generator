import { ArrowLeft } from 'lucide-react';
import { HTMLAttributes } from 'react';

import { Colors } from '@/components/deathnotice';
import { Button } from '@/components/ui/button';
import { DEFAULT_COLORS, DEFAULT_RESOLUTION, Resolution } from '@/consts';

import { Input } from './ui/input';
import { Label } from './ui/label';
import { Slider } from './ui/slider';

interface SettingsProps extends HTMLAttributes<HTMLDivElement> {
	open: boolean;
	setOpen: (open: boolean) => void;
	colors: Colors;
	setColors: (colors: Colors) => void;
	resolution: Resolution;
	setResolution: (resolution: Resolution) => void;
}

export default function SettingsDialog({
	open,
	setOpen,
	colors,
	setColors,
	resolution,
	setResolution,
	...props
}: SettingsProps) {
	const { ctColor, tColor, borderColor, bgColor, bgOpacity, localBgColor, localBgOpacity } = colors;
	return (
		<div
			{...props}
			className='flex flex-col gap-4 text-nowrap duration-300 animate-in fade-in-50 slide-in-from-left-1/2 lg:w-1/3'
		>
			<Button size='icon' variant='ghost' onClick={() => setOpen(false)}>
				<ArrowLeft size='1.25rem' />
			</Button>
			<div className='contents md:max-lg:flex md:max-lg:w-full md:max-lg:items-start md:max-lg:gap-4'>
				<div className='contents min-[520px]:max-md:flex min-[520px]:max-md:gap-4'>
					<div className='flex gap-4'>
						<div className='flex w-fit flex-col items-center gap-2'>
							<Label>Width</Label>
							<Input
								className='w-16 text-center'
								value={resolution.width}
								onChange={(v) => {
									let value = Number(v.target.value);
									value = isNaN(value) ? DEFAULT_RESOLUTION.width : value;
									value = value < 0 ? 0 : value;
									setResolution({ ...resolution, width: value });
								}}
							/>
						</div>
						<div className='flex w-fit flex-col items-center gap-2'>
							<Label>Height</Label>
							<Input
								className='w-16 text-center'
								value={resolution.height}
								onChange={(v) => {
									let value = Number(v.target.value);
									value = isNaN(value) ? DEFAULT_RESOLUTION.height : value;
									value = value < 0 ? 0 : value;
									setResolution({ ...resolution, height: value });
								}}
							/>
						</div>
					</div>

					<div className='flex items-center gap-4'>
						<div className='flex w-fit flex-col items-center gap-2'>
							<Label>CT Color</Label>
							<Input
								value={ctColor}
								className='h-10 w-10 p-1 px-1.5'
								type='color'
								onChange={(v) => setColors({ ...colors, ctColor: v.target.value })}
							/>
						</div>
						<div className='flex w-fit flex-col items-center gap-2'>
							<Label>T Color</Label>
							<Input
								className='h-10 w-10 p-1 px-1.5'
								type='color'
								value={tColor}
								onChange={(v) => setColors({ ...colors, tColor: v.target.value })}
							/>
						</div>
						<div className='flex w-fit flex-col items-center gap-2'>
							<Label>Border</Label>
							<Input
								className='h-10 w-10 p-1 px-1.5'
								type='color'
								value={borderColor}
								onChange={(v) => setColors({ ...colors, borderColor: v.target.value })}
							/>
						</div>
						<div className='flex w-fit flex-col items-center gap-2'>
							<Label>BG</Label>
							<Input
								className='h-10 w-10 p-1 px-1.5'
								type='color'
								value={bgColor}
								onChange={(v) => setColors({ ...colors, bgColor: v.target.value })}
							/>
						</div>
						<div className='flex w-fit flex-col items-center gap-2'>
							<Label>Local BG</Label>
							<Input
								className='h-10 w-10 p-1 px-1.5'
								type='color'
								value={localBgColor}
								onChange={(v) => setColors({ ...colors, localBgColor: v.target.value })}
							/>
						</div>
					</div>
				</div>

				<div className='flex items-center gap-4 md:max-lg:flex-grow'>
					<div className='flex w-1/2 flex-col items-center gap-4'>
						<Label>{`BG Opacity (${bgOpacity}%)`}</Label>
						<Slider
							max={100}
							min={0}
							step={1}
							value={[bgOpacity]}
							onValueChange={(v) => setColors({ ...colors, bgOpacity: v[0] })}
						/>
					</div>
					<div className='flex w-1/2 flex-col items-center gap-4'>
						<Label>{`Local BG Opacity (${localBgOpacity}%)`}</Label>
						<Slider
							max={100}
							min={0}
							step={1}
							value={[localBgOpacity]}
							onValueChange={(v) => setColors({ ...colors, localBgOpacity: v[0] })}
						/>
					</div>
				</div>
			</div>
			<Button
				onClick={() => {
					setColors(DEFAULT_COLORS);
					setResolution(DEFAULT_RESOLUTION);
				}}
			>
				Reset
			</Button>
		</div>
	);
}
