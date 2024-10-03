import { storyBotHeader, smallInputBox, subtitle, bigGreenActionButton } from "./styles.module.scss"
import React, {useState} from "react";

type WelcomeProps = {
    setServerIP: (s: string) => void
}

const Welcome: React.FC<WelcomeProps> = (props) => {
    const [serverIP, setServerIP] = useState("");
    const [name, setName] = useState("");

    return (
        <div>
            <h1 className={storyBotHeader}>StoryBot</h1>
            <h2 className={subtitle}> Welcome to your magical storytelling adventure!</h2>
            <div>
                <h3>How to Play:</h3>
                <ul>
                    <li>The goal is to create a story together, one turn at a time.</li>
                    <li>Wait for your turn while others are writing.</li>
                    <li>When it's your turn, you'll receive the last words from the previous player—continue from there!</li>
                    <li>The game ends with a fun, collaborative story.</li>
                </ul>
            </div>
            <input placeholder={"Server IP"} className={smallInputBox} style={{marginTop: "112px"}} type="text" value={serverIP} onChange={(e) => {setServerIP(e.target.value)}} />
            <input placeholder={"Your Name"} className={smallInputBox} style={{marginTop: "36px"}} type="text" value={name} onChange={(e) => {setName(e.target.value)}} />
            <button className={bigGreenActionButton} style={{ marginTop: "86px" }} onClick={(e) => {
                props.setServerIP(serverIP)
            }}>Let's go</button>
        </div>
    )
}

export default Welcome