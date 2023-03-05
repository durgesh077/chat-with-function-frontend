import React,{useState,useEffect} from 'react'
import JSZip from 'jszip';
import axios from 'axios';
import Ask from '../../components/Ask/Ask'
import Response from '../../components/Response/Response'
import SearchBox from '../../components/SearchBox/SearchBox'
import styles from './DeployPanel.module.scss'
import constants from '../../constants/constants';
const defaultPrompts = ["take two strings as parameter and return contatenation of them in upper case",
                        "return object passed in parameter", 
                        "add two number",
                        "return the sum of all numbers in an array"]
function DeployPanel() {
    const randomPrompt = defaultPrompts[Math.floor(Math.random() * defaultPrompts.length)]
    const [prompts, setPrompts] = useState([randomPrompt])
    const chatBoxRef = React.useRef(null)
    const collection_deploy = React.useRef([]);
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

    function deploy(){
        if(collection_deploy.current.length ===0)
           return alert("No function selected ")
        
        const zip =new JSZip();
        const jsFolder = zip.folder('js');
        const filename = collection_deploy.current.map(([func_name])=>func_name).join("_");
        const content = collection_deploy.current.map(([func_name,func_def])=>"module.exports."+ func_def).join("\n\n");
        const file = new File([content], `${filename}.js`,{type: "text/plain"});
        jsFolder.file(file.name, file);
        const metacall_json = JSON.stringify([{
            language_id : "node",
            path:"./js",
            scripts:[file.name]
        }])

        zip.generateAsync({type:"blob",
                            mimeType: 'application/zip-x-compress'
                        }).then(async(generatedZipFile)=>{
            const fd = new FormData();
            fd.append("jsons",metacall_json);
            fd.append("blob",generatedZipFile,file.name);
            fd.append("name",file.name);
            fd.append("runners",JSON.stringify(["node"]));
            try{
                const create_response = await axios.post(`/api/create`,fd).then(res=>res.data);
                let data = await axios.post(`/api/deploy`).then(res=>res.data);
                localStorage.setItem("suffix",data.suffix);
                alert('deployed '+file.name+' successfully');
            }catch(err){
                alert(err.message)
            }
        })

    }
    return (
        <div className={styles.home}>
            <div className={styles.wrapper_chat}>
                <div className={styles.chats} ref = {chatBoxRef} >
                {
                    prompts.map(prompt=>{
                        return (
                            <React.Fragment>
                                <Ask query = {prompt}/>
                                <Response onLoadComplete={goToLast} key={prompt} prompt={prompt} collection_deploy={collection_deploy}/>
                            </React.Fragment>
                        )
                    })
                }
                </div>
            </div>
            <div className={styles.controller}>
                <SearchBox placeholder="Ask functionality e.g: print hello world" onEnter={onSend} className={styles.SearchBox}/>
                <button onClick={deploy}>
                    deploy selected Functions
                </button>
            </div>
        </div>
    )
}

export default DeployPanel
