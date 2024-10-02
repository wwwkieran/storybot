import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Welcome from "../components/welcome";
import Lobby from "../components/lobby";
import Awaiting from "../components/awaiting";
import Turn from "../components/turn";
import Gameover from "../components/gameover";

const IndexPage: React.FC<PageProps> = () => {
  return (
   <Gameover messages={[
       {
           content: "I like to eat",
           name: "Kieran"
       },
       {
           content: "bananas in the morning.bananas in the morning. bananas in the morning. bananas in the morning. bananas in the morning.  ",
           name: "AI"
       },
       {
           content: "Morning is nice.",
           name: "John"
       },
   ]} playAgainFn={() => {}}/>
  )
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
