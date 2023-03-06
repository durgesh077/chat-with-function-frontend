import React,{ useEffect, useLayoutEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
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

    function handleEffectMounseIn(e){
        const checkbox = e.target.querySelector("[class*=response_checkbox]")
        checkbox.style.opacity=1;
        const menus = e.target.querySelector("[class*=executeWrapper]")
        menus.style.opacity=1;
    }   
    function handleEffectMounseOut(e){
        const checkbox = e.target.querySelector("[class*=response_checkbox]")
        if (!checkbox.checked)
            checkbox.style.opacity=0;
        const menus = e.target.querySelector("[class*=executeWrapper]")
        menus.style.opacity=0;    
    }
    return (
        <React.Fragment>
            <div className={styles.response}
                onMouseEnter={handleEffectMounseIn}
                onMouseLeave={handleEffectMounseOut}>
                {
                    loading?
                    <div className={styles.loading}>
                        {
                            ".".repeat(numDots)
                        }
                    </div>
                    :
                    <pre className={`${styles.response_content} ${error?styles.error:""}`} >
                        <div className={styles.executeWrapper} id='executionMenu'>
                            <button onClick={()=>{ countRetry.current=0 ;ask(prompt) }} className={styles.retry}>
                                <FontAwesomeIcon icon={faRedo}/>
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
                        <span className={styles.definition_body}>{error? "unable to create function ":response?.function_def}</span>
                        <input type="checkbox" 
                                value={checked} 
                                className={styles.response_checkbox} 
                                onChange={handleChange}
                                id= 'responseSelectionCheckbox'/>
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