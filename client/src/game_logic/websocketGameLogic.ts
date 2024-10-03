import IGameLogic, {ISubmissionMessage} from "./IGameLogic";

type SocketGameLogicProps = {
    setNames: (arg0: string[]) => void
    setPageDisplayed: (arg0: number) => void
    serverIP: string,
    myName: string,
}

class SocketGameLogic implements IGameLogic {
    prevSubmission: string;
    submissionMessages: ISubmissionMessage[];
    emitStartGame: () => void
    emitSubmission: (submission: string) => void
    successfullyOpenedSocket: boolean

    constructor(props: SocketGameLogicProps) {
        this.prevSubmission = ""
        this.submissionMessages = []
        this.successfullyOpenedSocket = false
        this.emitStartGame = () => {}
        this.emitSubmission = (s: string) => {}

        try {
            const ws = new WebSocket('ws://' + props.serverIP);

            const didSuccessfullyConnect = () => {
                this.successfullyOpenedSocket = true
            }
            ws.onopen = (ev) => {
                ws.send(JSON.stringify({
                    type: 'ENTER_PLAYER',
                    player_name: props.myName
                }));
                didSuccessfullyConnect()
            };

            ws.onmessage = (ev) => {
                const struct = JSON.parse(ev.data)
                console.log(struct)

                switch (struct.type) {
                    case "CURRENT_PLAYERS":
                        props.setNames(struct.player_names)
                        props.setPageDisplayed(2)
                        break
                    case "TRIGGER_START":
                        props.setPageDisplayed(3)
                        break
                    case "YOUR_TURN":
                        props.setPageDisplayed(4)
                        this.prevSubmission = struct.last_message.sentence
                        break
                    case "GAME_ENDED":
                        props.setPageDisplayed(5)
                        this.submissionMessages = struct.story
                        break
                    case "error":
                        console.log(struct)
                }
            };


            this.emitStartGame = () => {
                ws.send(JSON.stringify({
                    type: "GAME_START"
                }))
            }

            this.emitSubmission = (s: string) => {
                ws.send(JSON.stringify({
                    type: "USER_SUBMITTED",
                    player_name: props.myName,
                    sentence: s
                }))
                props.setPageDisplayed(3)
            }
        } catch (e) {
           console.log("")
        }
    }
}

export default SocketGameLogic