import { create } from 'zustand';

export type EditorClip = {
  id: string;
  name: string;
  url: string;
  start: number;
  end: number;
  duration: number;
};

type EditorState = {
  clips: EditorClip[];
  selectedClipId: string | null;
  playhead: number;
  addClip: (clip: EditorClip) => void;
  removeClip: (id: string) => void;
  selectClip: (id: string | null) => void;
  setPlayhead: (time: number) => void;
  trimClip: (id: string, start: number, end: number) => void;
  splitClipAtPlayhead: () => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  clips: [],
  selectedClipId: null,
  playhead: 0,
  addClip: (clip) =>
    set((state) => ({
      clips: [...state.clips, clip],
      selectedClipId: clip.id,
    })),
  removeClip: (id) =>
    set((state) => ({
      clips: state.clips.filter((clip) => clip.id !== id),
      selectedClipId:
        state.selectedClipId === id ? null : state.selectedClipId,
    })),
  selectClip: (id) => set({ selectedClipId: id }),
  setPlayhead: (time) => set({ playhead: time }),
  trimClip: (id, start, end) =>
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === id
          ? {
              ...clip,
              start: Math.max(0, Math.min(start, clip.duration)),
              end: Math.min(clip.duration, Math.max(end, start + 0.1)),
            }
          : clip
      ),
    })),
  splitClipAtPlayhead: () =>
    set((state) => {
      const clip = state.clips.find(
        (item) => item.id === state.selectedClipId
      );

      if (!clip) return state;

      const splitTime = state.playhead;

      if (splitTime <= clip.start + 0.1 || splitTime >= clip.end - 0.1) {
        return state;
      }

      const firstClip: EditorClip = {
        ...clip,
        end: splitTime,
      };

      const secondClip: EditorClip = {
        ...clip,
        id: crypto.randomUUID(),
        start: splitTime,
      };

      return {
        clips: state.clips.flatMap((item) =>
          item.id === clip.id ? [firstClip, secondClip] : [item]
        ),
        selectedClipId: secondClip.id,
      };
    }),
}));
