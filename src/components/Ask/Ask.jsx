import { useEffect, useRef, useState } from 'react'
import useGetResponse from '../../customHooks/useGetResponse'
import styles from './Response.module.scss'
export default function Response({ prompt, onLoadComplete }) {
    const [numDots, setNumDots] = useState(1)
    const asked = useRef(false)
    const {ask, response, error, isLoading:loading} = useGetResponse()
    useEffect(()=>{
        if(asked.current===false) {
            asked.current = true
            return
        }
        if(prompt){
            ask(prompt)
        }
    },[ask])


    useEffect(()=>{
        if(!loading ){
            onLoadComplete()
            return
        }
        const interval = setInterval(()=>{
            setNumDots(numDots=>numDots===5?1:numDots+1)
        }, 300)
        return ()=>clearInterval(interval)
    },[loading])
    
    return (
        <div className={styles.response}>
            {
                loading?
                <div className={styles.loading}>
                    {
                        ".".repeat(numDots)
                    }
                </div>
                :
                <pre className={styles.response__content}>
                    
                    {response?.function_def}
                </pre>
            }
        </div>
    )
}