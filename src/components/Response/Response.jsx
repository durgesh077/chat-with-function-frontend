import React,{ useEffect, useLayoutEffect, useRef, useState } from 'react'
import useGetResponse from '../../customHooks/useGetResponse'
import ModalCustom from '../Modal/Modal'
import Execute from './components/Execute'
import styles from './Response.module.scss'
export default function Response({ prompt, onLoadComplete , collection_deploy }) {
    const [numDots, setNumDots] = useState(1)
    const [checked, setChecked] = useState(false);
    const [modal , setModal] = useState(null)
    const countRetry = useRef(0)
    const [renderer , setRenderer] = useState(false);
    const {ask, data:response, error, isLoading:loading} = useGetResponse()
    const execute = useRef(null)
    useEffect(()=>{
        if(prompt){
            ask(prompt,{
                onError:()=>{
                    if(countRetry.current<8){
                        ask(prompt)
                        countRetry.current++
                    }
                }
            })
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
    
    useLayoutEffect(()=>{
        if(!response){
            execute.current=null
            return
        }

        try{
            window[response?.name]=null
            eval(`${response?.function_def}`)
            execute.current=(window[response?.name])
            setRenderer(prev=>!prev)
            countRetry.current=0
        } catch(e){
            if(countRetry.current<8){
                ask(prompt)
                countRetry.current++
            }
        }
    },[response])
    
    function handleExecution(){
        setModal(true)
    }

    function handleChange(e){
        if(checked === false)
            collection_deploy.current.push([response?.name, response?.function_def])
        else 
            collection_deploy.current = collection_deploy.current.filter(([func_name])=>{
            return func_name !== response?.name
            })

        setChecked(checked=>!checked);
    }
    return (
        <React.Fragment>
            <div className={styles.response}>
                {
                    loading?
                    <div className={styles.loading}>
                        {
                            ".".repeat(numDots)
                        }
                    </div>
                    :
                    <pre className={`${styles.response_content} ${error?styles.error:""}`}>
                        <div className={styles.executeWrapper}>
                            <button onClick={()=>{ countRetry.current=0 ;ask(prompt) }} className={styles.retry}>
                                        retry
                            </button>
                            {
                                execute.current?
                                    <button onClick={handleExecution} className={styles.execute}>
                                        Execute
                                    </button>
                                :
                                null
                            }
                        </div>
                        {error? "unable to create function ":response?.function_def}
                        <input type="checkbox" value={checked} className={styles.response_checkbox} onChange={handleChange}/>
                    </pre>
                }
            </div>
            <ModalCustom 
                modal = {modal} 
                setModal={setModal} 
                title={
                    <span style={{color: 'red',fontWeight: 'bold'}}>{response?.name?.split("_")?.join(" ")}</span>
                }
            >
                <Execute func={execute.current} params={response?.parameter_names??[]}/>
            </ModalCustom>
        </React.Fragment>
    )
}