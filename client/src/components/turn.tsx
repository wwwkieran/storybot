import { storyBotSmallHeader, bigText, subtitle, largeInputBox, bigGreenActionButton, prevSubBox, prevSubText } from "./styles.module.scss"
import React, { useState } from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./variants";

function getLastThreeWords(input: string): string {
    if (!input.trim()) {
        return "";
    }

    const words = input.trim().split(/\s+/);
    return words.slice(-3).join(" ");
}

type TurnProps = {
    prevSubmission: string
    emitSubmission: (arg0: string) => void
}

const Turn: React.FC<TurnProps> = (props) => {
    const [submission, setSubmission] = useState("");

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1 className={storyBotSmallHeader} variants={itemVariants}>StoryBot</motion.h1>
            <motion.h2 className={bigText} style={{ marginTop: '2vh', marginBottom: '5vh' }} variants={itemVariants}>It’s your turn!!</motion.h2>
            {props.prevSubmission !== "" ? (
                <>
                    <motion.h2 className={subtitle} variants={itemVariants}><b>Here’s what the last person wrote:</b></motion.h2>
                    <motion.div className={prevSubBox} variants={itemVariants}>
                        <p className={prevSubText}>
                            {getLastThreeWords(props.prevSubmission)}
                        </p>
                    </motion.div>
                </>
            ) : (
                <motion.h2 className={subtitle} variants={itemVariants}><b>You're first!! Start making up a story below.</b></motion.h2>
            )}
            <motion.h2 className={subtitle} style={{ marginTop: '2vh', marginBottom: '2vh' }} variants={itemVariants}><b>Continue the story and hit submit! Max 50 words</b></motion.h2>
            <motion.textarea
                placeholder={"Write the next sentence here!"}
                className={largeInputBox}
                style={{ marginTop: "0px" }}
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                variants={itemVariants}
            />
            <motion.button
                className={bigGreenActionButton}
                style={{ marginTop: '3vh' }}
                onClick={() => props.emitSubmission(submission)}
                variants={itemVariants}
            >
                Submit
            </motion.button>
        </motion.div>
    )
}

export default Turn