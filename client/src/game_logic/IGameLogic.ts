type IGameLogic = {
    emitStartGame: () => void
    emitSubmission: (submission: string) => void
    prevSubmission: string
    submissionMessages: ISubmissionMessage[]
}

export type ISubmissionMessage = {
    sentence: string
    name: string
}

export default IGameLogic