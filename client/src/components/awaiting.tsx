import { storyBotSmallHeader, bigText, subtitle } from "./styles.module.scss"
import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./variants";

const Awaiting: React.FC = (props) => {
    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1 className={storyBotSmallHeader} variants={itemVariants}>StoryBot</motion.h1>
            <motion.h2 className={bigText} style={{marginTop: '20vh', marginBottom: '20vh'}} variants={itemVariants}>It ain’t your turn...</motion.h2>
            <motion.h2 className={subtitle} variants={itemVariants}>Someone else is making up a sentence right now!</motion.h2>
            <motion.h2 className={subtitle} variants={itemVariants}>It’ll be your turn soon... I promise!</motion.h2>
        </motion.div>
    )
}

export default Awaiting