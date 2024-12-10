import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function KillfeedGenerator() {
	return (
		<div className='mx-auto flex w-full flex-col gap-4 p-4 lg:flex-row'>
			<div className='w-full space-y-4 lg:w-1/3'>
				<div className='flex items-center justify-between'>
					<h1 className='text-2xl font-bold'>CS2 Killfeed Generator</h1>
				</div>
				<div className='flex gap-2'>
					<Input placeholder='Killer name' className='flex-grow' />
					<div className='inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground'>
						<button
							className={cn(
								'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
								'bg-background text-foreground shadow-sm'
							)}
						>
							CT
						</button>
						<button
							className={cn(
								'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
							)}
						>
							T
						</button>
					</div>
				</div>
				<div className='flex gap-2'>
					<Input placeholder='Victim name' className='flex-grow' />
					<div className='inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground'>
						<button
							className={cn(
								'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
								'bg-background text-foreground shadow-sm'
							)}
						>
							CT
						</button>
						<button
							className={cn(
								'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
							)}
						>
							T
						</button>
					</div>
				</div>
				<div className='flex gap-2'>
					<Input placeholder='Assister name (optional)' className='flex-grow' />
					<div className='inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground'>
						<button
							className={cn(
								'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
								'bg-background text-foreground shadow-sm'
							)}
						>
							CT
						</button>
						<button
							className={cn(
								'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
							)}
						>
							T
						</button>
					</div>
				</div>
				<Select>
					<SelectTrigger className='w-full'>
						<SelectValue placeholder='Select weapon' />
					</SelectTrigger>
					<SelectContent></SelectContent>
				</Select>
				<div className='grid grid-cols-3 gap-2 overflow-hidden'>
					<Button variant='outline'>Headshot</Button>
					<Button variant='outline'>Wallbang</Button>
					<Button variant='outline'>Red Border</Button>
					<Button variant='outline'>Noscope</Button>
					<Button variant='outline'>In Air</Button>
					<Button variant='outline'>Through Smoke</Button>
					<Button variant='outline'>Blind</Button>
					<Button variant='outline'>Flash Assist</Button>
				</div>
				<div className='flex items-center gap-2'>
					<Button className='w-full'>Add entry</Button>
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
				<div className='h-96 rounded-lg bg-secondary'></div>
			</div>
		</div>
	);
}
