import { atom } from 'jotai';

export type ToolType = "select" | "pen" | "stickyNote" | "image" | "eraser" | "hand";

export const activeToolAtom = atom<ToolType>("pen");