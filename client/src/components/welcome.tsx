import { storyBotHeader, smallInputBox, subtitle, bigGreenActionButton } from "./styles.module.scss"
import React, {useState} from "react";

type WelcomeProps = {
    setServerIP: (s: string) => void
    setName: (s: string) => void
}

const Welcome: React.FC<WelcomeProps> = (props) => {
    const [serverIP, setServerIP] = useState("");
    const [name, setName] = useState("");

    return (
        <div>
            <h1 className={storyBotHeader}>StoryBot</h1>
            <h2 className={subtitle}> Welcome to your magical storytelling adventure!</h2>
            <input placeholder={"Server IP"} className={smallInputBox} style={{marginTop: "112px"}} type="text" value={serverIP} onChange={(e) => {setServerIP(e.target.value)}} />
            <input placeholder={"Your Name"} className={smallInputBox} style={{marginTop: "36px"}} type="text" value={name} onChange={(e) => {setName(e.target.value)}} />
            <button className={bigGreenActionButton} style={{ marginTop: "86px" }} onClick={(e) => {
                props.setName(name)
                props.setServerIP(serverIP)
            }}>Let's go</button>
        </div>
    )
}

export default Welcome
