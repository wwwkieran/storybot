import { storyBotHeader, nameTable, smallInputBox, subtitle, bigGreenActionButton, nameNumber, name } from "./styles.module.scss"
import React from "react";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "./variants";

type LobbyProps = {
    names: string[]
    emitStartGame: () => void
}

const Lobby: React.FC<LobbyProps> = (props) => {
    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1 className={storyBotHeader} variants={itemVariants}>StoryBot</motion.h1>
            <motion.h2 className={subtitle} variants={itemVariants}> You're connected to 127.0.0.1</motion.h2>
            <motion.table className={nameTable} variants={containerVariants}>
                {props.names.map((v, i) => {
                    return (
                        <motion.tr key={i} variants={itemVariants}>
                            <td className={nameNumber}>{i}</td>
                            <td className={name}>{v}</td>
                        </motion.tr>
                    )
                })}
            </motion.table>
            <motion.h2 className={subtitle} variants={itemVariants}> Hit <b> Start Game </b> once all your friends have joined!</motion.h2>
            <motion.button className={bigGreenActionButton} style={{ marginTop: "86px" }} onClick={(e) => {
                props.emitStartGame()
            }} variants={itemVariants}>Start Game</motion.button>
        </motion.div>
    )
}

export default Lobby