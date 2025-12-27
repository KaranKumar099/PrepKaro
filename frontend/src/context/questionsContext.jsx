import {createContext, useContext, useState} from "react"

const questionsContext = createContext()

export const QuestionProvider = ({children})=>{
    const [questions, setQuestions]=useState([])
    const [attemptId, setAttemptId]=useState('')

    return (
        <questionsContext.Provider value={{questions, setQuestions, attemptId, setAttemptId}}>
            {children}
        </questionsContext.Provider>
    )
}

export const useQuestions = ()=>useContext(questionsContext)