import { atom } from 'jotai';
import { fabric } from 'fabric';

export const canvasInstanceAtom = atom<fabric.Canvas | null>(null);