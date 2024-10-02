import { storyBotHeader, nameTable, smallInputBox, subtitle, bigGreenActionButton, nameNumber, name } from "./styles.module.scss"
import React, {useState} from "react";

type LobbyProps = {
    names: string[]
    emitStartGame: () => void
}

const Lobby: React.FC<LobbyProps> = (props) => {
    return (
        <div>
            <h1 className={storyBotHeader}>StoryBot</h1>
            <h2 className={subtitle}> You're connected to 127.0.0.1</h2>
            <table className={nameTable}>
                {props.names.map((v, i) => {
                    return (<tr>
                        <td className={nameNumber}>{i}</td><td className={name}>{v}</td>
                    </tr>)
                })}
            </table>



            <h2 className={subtitle}> Hit <b> Start Game </b> once all your friends have joined!</h2>
            <button className={bigGreenActionButton} style={{ marginTop: "86px" }} onClick={(e) => {
                props.emitStartGame()
            }}>Start Game</button>
        </div>
    )
}

export default Lobby
