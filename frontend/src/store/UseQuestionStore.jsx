import { create } from "zustand"

export const useQuestionStore = create((set) => ({
    questions: [],
    setQuestions: (quesData)=>set({questions: quesData}),
    attemptID: "",
    setAttemptID: (id)=>set({attemptID: id}),
    resetQuiz: () => set({ questions: [], attemptId: "" }),
}))