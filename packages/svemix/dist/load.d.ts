import type { Load } from '@sveltejs/kit';
interface SvemixLoadHandler {
    routesName: string;
}
export default function loadHandler({ routesName }: SvemixLoadHandler): Load;
export {};
