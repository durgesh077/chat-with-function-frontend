import React, { useContext, useEffect, useState } from 'react'
import Response from '../../components/Response/Response'
import SearchBox from '../../components/SearchBox/SearchBox'
import styles from './Home.module.scss'
const Home = () => {
    const [prompts, setPrompts] = useState([])
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
                            <Response onLoadComplete={goToLast} key={prompt} prompt={prompt}/>
                        )
                    })
                }
                </div>
            </div>
            <SearchBox placeholder="Ask functionality" onEnter={onSend} className={styles.searchBox}/>
        </div>
    )
}

export default Home
