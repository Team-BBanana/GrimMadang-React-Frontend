import { atom } from 'jotai';

export type ToolType = "select" | "pen" | "fill" | "image" | "eraser" | "hand";

export const activeToolAtom = atom<ToolType>("pen");