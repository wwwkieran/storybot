import { storyBotSmallHeader, bigText, subtitle, storyDiv, nameNumber, name, sentenceP, clickableP, wait, bigGreenActionButton, footerDiv, gameInstruction, footerDiv2 } from "./styles.module.scss"
import React, {useState} from "react";
import classNames from 'classnames';
import {ISubmissionMessage} from "../game_logic/IGameLogic";
import { motion } from "framer-motion";
import {containerVariants, itemVariants} from "./variants";

type GameoverProps = {
    messages: ISubmissionMessage[]
    playAgainFn: () => void
}

const colors = [
    '#CDE1A5',
    '#E1D3A5',
    '#DEA5E1',
    '#A5C2E1',
    '#E1CBA5',
    '#A5E1D6',
]

const returnHeader = (gameStatus: string) => {
    if (gameStatus === 'win') {
        return <h2 className={bigText} style={{color: '#7CBE66', marginTop: '2vh', marginBottom: '2vh'}}>You win!!!</h2>
    }
    if (gameStatus === 'lose') {
        return <h2 className={bigText} style={{color: '#A64848', marginTop: '2vh', marginBottom: '2vh'}}>You lose!!!</h2>
    }
    return <h2 className={bigText} style={{marginTop: '2vh', marginBottom: '2vh'}}>Game’s over!</h2>
}

const waitVariants = {
    hidden: { scale: 0 },
    visible: { scale: [3, 1], transition: { duration: 2, type: "spring", stiffness: 100, times: [1.5, 0.5] } }
};

const returnFooter = (gameStatus: string, messages: ISubmissionMessage[], playAgainfn: () => void) => {
    if (gameStatus === "unresolved") {
        return <motion.div className={footerDiv} variants={containerVariants}>
            <motion.h2 className={wait} variants={waitVariants} initial="hidden" animate="visible">BUT WAIT!!!</motion.h2>
            <motion.h3 className={gameInstruction} variants={itemVariants}>There was an an AI imposter playing with you!!</motion.h3>
            <motion.h3 className={gameInstruction} variants={itemVariants}><b>Can you identify the sentence that was generated by AI?</b></motion.h3>
            <motion.h3 className={gameInstruction} variants={itemVariants}>Click on the sentence you believe was generated by AI.</motion.h3>
        </motion.div>
    }

    return <motion.div className={footerDiv2} variants={containerVariants}>
        <motion.div variants={itemVariants}>
            {messages.map((v, i) => {
                return (<tr>
                    <td className={nameNumber}>{i}</td>
                    <td className={name} style={{backgroundColor: colors[i]}}>{v.name}</td>
                </tr>)
            })}
        </motion.div>
        <motion.div style={{width: "600px"}} variants={itemVariants}>
            {gameStatus === "win" && (<h3 className={gameInstruction}>Since you won, you get a cookie. </h3>)}
            {gameStatus === "lose" &&
                (<h3 className={gameInstruction}>Since you lost, one of your friends will lose their job. Your friends are
                    indistinguishable from AI, so corporate says they must be replaced by robots.</h3>)}
            <button className={bigGreenActionButton} style={{marginTop: "2px"}} onClick={(e) => {
                playAgainfn()
            }}>Play again?</button>
        </motion.div>
    </motion.div>
}

const Gameover: React.FC<GameoverProps> = (props) => {
    const [clickable, setClickable] = useState(true)
    const [gameStatus, setGameStatus] = useState("unresolved")

    const clicked = (idx: number) => {
        if (clickable) {
            setClickable(false)
            if (props.messages[idx].name === "AI") {
                setGameStatus("win")
            } else {
                setGameStatus("lose")
            }
        }
    }

    return (
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
            <motion.h1 className={storyBotSmallHeader} variants={itemVariants}>StoryBot</motion.h1>
            {returnHeader(gameStatus)}
            <motion.h2 className={subtitle} variants={itemVariants}><b>Here’s the story you wrote!!</b></motion.h2>
            <motion.div className={storyDiv} variants={containerVariants}>
                {props.messages.map((v, i) => {
                    return (<motion.p className={classNames(sentenceP, { [clickableP]: clickable })} style={{backgroundColor: colors[i]}} onClick={() => clicked(i)} variants={itemVariants}> {v.sentence} </motion.p>)
                })}
            </motion.div>
            {returnFooter(gameStatus, props.messages, props.playAgainFn)}
        </motion.div>
    )
}

export default Gameover