import { storyBotSmallHeader, bigText, subtitle } from "./styles.module.scss"
import React, {useState} from "react";


const Awaiting: React.FC = (props) => {
    return (
        <div>
            <h1 className={storyBotSmallHeader}>StoryBot</h1>
            <h2 className={bigText}>It ain’t your turn...</h2>
            <h2 className={subtitle}>Someone else is making up a sentence right now!</h2>
            <h2 className={subtitle}>It’ll be your turn soon... I promise!</h2>
        </div>
    )
}

export default Awaiting
