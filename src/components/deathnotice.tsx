import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

function getUrl(path: string) {
	const url = new URL(path, import.meta.url).href;
	return url;
}

type DeathNoticeIconType = {
	type: 'blind_kill' | 'icon_headshot' | 'inairkill' | 'noscope' | 'penetrate' | 'smoke_kill';
};

type DeathNoticeIconWeapon = {
	type: 'weapon';
	weapon: string;
};

interface DeathNoticeIconProps extends React.HTMLAttributes<HTMLImageElement> {
	data: DeathNoticeIconType | DeathNoticeIconWeapon;
}

const DeathNoticeIcon = ({ data, className }: DeathNoticeIconProps) => {
	const src =
		data.type === 'weapon' ? getUrl(`/weapons/${data.weapon}.svg`) : getUrl(`/deathnotice/${data.type}.svg`);

	return (
		<img
			className={cn('mx-[2px] mb-0 mt-[-2px] h-[24px] object-contain align-middle', className)}
			src={src}
			alt={data.type === 'weapon' ? data.weapon : data.type}
		/>
	);
};

interface DeathNoticeLabelProps extends React.HTMLAttributes<HTMLLabelElement> {
	side: 'T' | 'CT';
}

const DeathNoticeLabel = ({ side, children, className }: DeathNoticeLabelProps) => {
	return (
		<Label
			className={cn(
				'm-[2px] mt-0 max-h-8 max-w-40 text-ellipsis whitespace-nowrap font-stratum2 text-[17px] tracking-normal',
				side === 'T' ? 'text-[#eabe54]' : 'text-[#6f9ce6]',
				className
			)}
			style={{ filter: 'drop-shadow(1px 1px 0px black)' }}
		>
			{children}
		</Label>
	);
};

export type DeathNoticeT = {
	attacker: string;
	victim: string;
	weapon: string;
	attackerSide: 'T' | 'CT';
	victimSide: 'T' | 'CT';
	blind: boolean;
	noscope: boolean;
	smoke: boolean;
	penetrate: boolean;
	headshot: boolean;
	inair: boolean;
	assister?: string;
	assisterSide?: 'T' | 'CT';
	flashAssist?: boolean;
	isLocal?: boolean;
};

interface DeathNoticeProps extends React.HTMLAttributes<HTMLDivElement> {
	deathnoticeData: DeathNoticeT;
}

export default function DeathNotice({ deathnoticeData, className, style, ...props }: DeathNoticeProps) {
	const {
		attacker,
		victim,
		weapon,
		attackerSide,
		victimSide,
		blind,
		noscope,
		smoke,
		penetrate,
		headshot,
		inair,
		assister,
		assisterSide,
		flashAssist,
		isLocal
	} = deathnoticeData;

	return (
		<div
			className={cn(
				'relative mt-1.5 w-fit rounded bg-black/40 text-right transition-all duration-200 ease-out',
				isLocal && 'border-[3px] border-[#e10000] bg-black/90',
				className
			)}
			style={style}
			{...props}
		>
			<div className='flex items-center px-[10px] pb-[3px] pt-[6px]'>
				{blind && <DeathNoticeIcon data={{ type: 'blind_kill' }} />}
				<DeathNoticeLabel side={attackerSide}>{attacker}</DeathNoticeLabel>
				{assister && assisterSide && (
					<>
						<DeathNoticeLabel side={assisterSide} className='mt-[-3px] font-sans text-gray-300'>
							+
						</DeathNoticeLabel>
						{flashAssist && <DeathNoticeIcon data={{ type: 'weapon', weapon: 'flashbang_assist' }} />}
						<DeathNoticeLabel side={assisterSide}>{assister}</DeathNoticeLabel>
					</>
				)}
				{inair && (
					<DeathNoticeIcon
						data={{ type: 'inairkill' }}
						className='mb-0 ml-[2px] mr-[-4px] mt-[-24px] h-[26px]'
					/>
				)}
				<DeathNoticeIcon data={{ type: 'weapon', weapon }} />
				{noscope && <DeathNoticeIcon data={{ type: 'noscope' }} />}
				{smoke && <DeathNoticeIcon data={{ type: 'smoke_kill' }} />}
				{penetrate && <DeathNoticeIcon data={{ type: 'penetrate' }} />}
				{headshot && <DeathNoticeIcon data={{ type: 'icon_headshot' }} className='mt-[-4px]' />}
				<DeathNoticeLabel side={victimSide}>{victim}</DeathNoticeLabel>
			</div>
		</div>
	);
}
