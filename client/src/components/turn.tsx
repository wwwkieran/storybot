import { storyBotSmallHeader, bigText, subtitle, largeInputBox, bigGreenActionButton, prevSubBox, prevSubText } from "./styles.module.scss"
import React, {useState} from "react";

type TurnProps = {
    prevSubmission: string
    emitSubmission: (arg0: string) => void
}

const Turn: React.FC<TurnProps> = (props) => {
    const [submission, setSubmission] = useState("");


    return (
        <div>
            <h1 className={storyBotSmallHeader}>StoryBot</h1>
            <h2 className={bigText} style={{marginTop: '2vh', marginBottom: '5vh'}}>It’s your turn!!</h2>
            { props.prevSubmission != "" ? (<><h2 className={subtitle}><b>Here’s what the last person wrote:</b></h2>
            <div className={prevSubBox}>
                <p className={prevSubText}>
                    {props.prevSubmission}
                </p>
            </div></>) : (<h2 className={subtitle}><b>You're first!! Start making up a story below.</b></h2>) }
            <h2 className={subtitle}  style={{marginTop: '2vh', marginBottom: '2vh'}}><b>Continue the story and hit submit! Max 50 words</b></h2>
            <textarea placeholder={"Write the next sentence here!"}
                   className={largeInputBox}
                   style={{marginTop: "0px"}}
                   value={submission}
                   onChange={(e) => {
                       setSubmission(e.target.value)
                   }}
            />
            <button className={bigGreenActionButton} style={{marginTop: '3vh'}} onClick={(e) => {
                props.emitSubmission(submission)
            }}>Submit</button>
        </div>
    )
}

export default Turn
