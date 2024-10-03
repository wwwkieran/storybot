import { storyBotHeader, smallInputBox, subtitle, bigGreenActionButton, howToPlay } from "./styles.module.scss"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./variants";

type WelcomeProps = {
    setServerIP: (s: string) => void
    setName: (s: string) => void
}

const Welcome: React.FC<WelcomeProps> = (props) => {
    const [serverIP, setServerIP] = useState("");
    const [name, setName] = useState("");

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1 className={storyBotHeader} variants={itemVariants}>StoryBot</motion.h1>
            <motion.div className={howToPlay} variants={itemVariants}>
                <h3 ><b>How to Play:</b></h3>
                <ul>
                    <li>The goal is to create a story together, one turn at a time.</li>
                    <li>Wait for your turn while others are writing.</li>
                    <li>When it's your turn, you'll receive the last words from the previous player—continue from there!</li>
                    <li>The game ends with a fun, collaborative story.</li>
                </ul>
            </motion.div>
            <motion.input
                placeholder={"Server IP"}
                className={smallInputBox}
                style={{ marginTop: "50px" }}
                type="text"
                value={serverIP}
                onChange={(e) => { setServerIP(e.target.value) }}
                variants={itemVariants}
            />
            <motion.input
                placeholder={"Your Name"}
                className={smallInputBox}
                style={{ marginTop: "36px" }}
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value) }}
                variants={itemVariants}
            />
            <motion.button
                className={bigGreenActionButton}
                style={{ marginTop: "86px" }}
                onClick={(e) => {
                    props.setName(name)
                    props.setServerIP(serverIP)
                }}
                variants={itemVariants}
            >
                Let's go
            </motion.button>
        </motion.div>
    )
}

export default Welcome