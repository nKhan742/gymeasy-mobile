import { create } from 'zustand';

interface SelectedExercise {
  name: string;
  category: string;
  exercises: string[];
}

interface ExercisesStore {
  selectedExercises: SelectedExercise[];
  addExercise: (exercise: SelectedExercise) => void;
  removeExercise: (name: string) => void;
  clearSelected: () => void;
  isExerciseSelected: (name: string) => boolean;
}

export const useExercisesStore = create<ExercisesStore>((set, get) => ({
  selectedExercises: [],

  addExercise: (exercise: SelectedExercise) =>
    set((state) => ({
      selectedExercises: [...state.selectedExercises, exercise],
    })),

  removeExercise: (name: string) =>
    set((state) => ({
      selectedExercises: state.selectedExercises.filter((ex) => ex.name !== name),
    })),

  clearSelected: () => set({ selectedExercises: [] }),

  isExerciseSelected: (name: string) => {
    return get().selectedExercises.some((ex) => ex.name === name);
  },
}));
