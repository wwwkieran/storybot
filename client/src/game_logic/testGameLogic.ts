import IGameLogic, {ISubmissionMessage} from "./IGameLogic";

type TestGameLogicProps = {
    setNames: (arg0: string[]) => void
    setPageDisplayed: (arg0: number) => void
    myName: string,
}

class TestGameLogic implements IGameLogic {
    prevSubmission: string;
    submissionMessages: ISubmissionMessage[];
    emitStartGame: () => void
    emitSubmission: (submission: string) => void

    constructor(props: TestGameLogicProps) {
        this.prevSubmission = "hedgehog"
        this.submissionMessages = [
            {
                sentence: "I like to eat",
                name: "Kieran"
            },
            {
                sentence: "bananas in the morning.bananas in the morning. bananas in the morning. bananas in the morning. bananas in the morning.  ",
                name: "AI"
            },
            {
                sentence: "Morning is nice.",
                name: "John"
            },
    ]
        props.setNames(["Kieran", "Gonzalo"])

        this.emitStartGame = () => {
            props.setPageDisplayed(3)
            new Promise(r => setTimeout(r, 2000)).finally(() => {
                props.setPageDisplayed(4)
            })
        }

        this.emitSubmission = (s: string) => {
            this.submissionMessages.push({
                sentence: s,
                name: props.myName
            })
            props.setPageDisplayed(5)
        }
    }




}

export default TestGameLogic