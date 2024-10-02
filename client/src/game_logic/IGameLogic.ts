type IGameLogic = {
    emitStartGame: () => void
    emitSubmission: (submission: string) => void
    prevSubmission: string
    submissionMessages: ISubmissionMessage[]
}

export type ISubmissionMessage = {
    content: string
    name: string
}

export default IGameLogic