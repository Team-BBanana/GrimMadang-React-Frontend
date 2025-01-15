import { atom } from 'jotai';

const activeToolAtom = atom<string | null>(null);

export default activeToolAtom;