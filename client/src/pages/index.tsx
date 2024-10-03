import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Welcome from "../components/welcome";
import Lobby from "../components/lobby";
import Awaiting from "../components/awaiting";
import Turn from "../components/turn";
import Gameover from "../components/gameover";
import {useEffect, useState} from "react";
import IGameLogic from "../game_logic/IGameLogic";
import TestGameLogic from "../game_logic/testGameLogic";
import SocketGameLogic from "../game_logic/websocketGameLogic";

const IndexPage: React.FC<PageProps> = () => {
    const [pageDisplayed, setPageDisplayed] = useState(1);
    const [names, setNames] = useState<string[]>([]);
    const [gameEngine, setGameEngine] = useState<IGameLogic | null>(null)
    const [serverIP, setServerIP] = useState<string>("")
    const [name, setName] = useState<string>("")


    useEffect(() => {
        if (serverIP === 'test') {
            setGameEngine(new TestGameLogic({
                setPageDisplayed: (n: number) => { setPageDisplayed(n) } ,
                setNames: (n: string[]) => {setNames(n)} ,
                myName: name,
            }))
            setPageDisplayed(2)
        } else if (serverIP != "") {
            const socketGameLogic = new SocketGameLogic({
                    setPageDisplayed: (n: number) => { setPageDisplayed(n) } ,
                    setNames: (n: string[]) => {setNames(n)} ,
                    myName: name,
                    serverIP: serverIP,
                })
            setGameEngine(socketGameLogic)
        }
    }, [serverIP]);

    switch (pageDisplayed) {
        case 1:
            return <Welcome setServerIP={(s: string) => {setServerIP(s)}} setName={(s: string) => {setName(s)}}/>
        case 2:
            return <Lobby names={names} emitStartGame={gameEngine!.emitStartGame}/>
        case 3:
            return <Awaiting/>
        case 4: 
            return <Turn prevSubmission={gameEngine!.prevSubmission} emitSubmission={gameEngine!.emitSubmission}/>
        case 5:
            return <Gameover messages={gameEngine!.submissionMessages} playAgainFn={() => {setPageDisplayed(1)}}/>
    }

}

export default IndexPage

export const Head: HeadFC = () => (
    <>
    <title>Home Page</title>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={"anonymous"}/>
        <link href="https://fonts.googleapis.com/css2?family=Irish+Grover&display=swap" rel="stylesheet"/>
        <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Irish+Grover&display=swap" rel="stylesheet"/>
    </>
)
