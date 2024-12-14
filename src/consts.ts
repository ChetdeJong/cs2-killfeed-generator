import { Colors } from '@/components/deathnotice';

export const MAPS = [
	'de_vertigo',
	'de_ancient',
	'de_anubis',
	'de_dust2',
	'de_inferno',
	'de_mirage',
	'de_nuke',
	'de_overpass'
] as const;

export const DEFAULT_COLORS: Colors = {
	ctColor: '#6f9ce6',
	tColor: '#eabe54',
	borderColor: '#e10000',
	bgColor: '#000000',
	bgOpacity: 40,
	localBgColor: '#000000',
	localBgOpacity: 90
};

export type Resolution = { width: number; height: number };
export const DEFAULT_RESOLUTION: Resolution = { width: 1920, height: 1080 };
