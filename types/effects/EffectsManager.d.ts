import type { Effect } from '@/types';
export default function EffectsManager(this: {
    effectElements: Effect['ef'];
}, data: Effect, element: unknown): void;
