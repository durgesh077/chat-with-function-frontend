import React, { useContext, useEffect, useState } from 'react'
import Ask from '../../components/Ask/Ask'
import Response from '../../components/Response/Response'
import SearchBox from '../../components/SearchBox/SearchBox'
import styles from './Home.module.scss'
const defaultPrompts = ["take two strings as parameter and return contatenation of them in upper case",
                        "return object passed in parameter", 
                        "add two number",
                        "return the sum of all numbers in an array"]
const Home = () => {
    //choose any of the above prompts randomly
    const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)]
    const [prompts, setPrompts] = useState([randomPrompt])
    const chatBoxRef = React.useRef(null)
    function goToLast(){
        setTimeout(()=>{
            const messageBody = chatBoxRef.current;
            messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
        }, 100)
    }
    function onSend(prompt){
        setPrompts([...prompts, prompt])
        goToLast()
    }
    return (
        <div className={styles.home}>
            <h1 className={styles.h1}>Chat with Functions</h1>
            <div className={styles.wrapper_chat}>
                <div className={styles.chats} ref = {chatBoxRef} >
                {
                    prompts.map(prompt=>{
                        return (
                            <React.Fragment>
                                <Ask query = {prompt}/>
                                <Response onLoadComplete={goToLast} key={prompt} prompt={prompt}/>
                            </React.Fragment>
                        )
                    })
                }
                </div>
            </div>
            <SearchBox placeholder="Ask functionality e.g: print hello world" onEnter={onSend} className={styles.searchBox}/>
        </div>
    )
}

export default Home
