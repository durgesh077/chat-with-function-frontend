import axios from "axios";
import {useContext} from "react";
import {useMutation} from "react-query";
import { MessageContext } from "../components/MessageStack/MessageStack";
const searchSubjectAPI=async (params)=>{
    const signature = JSON.stringify(params);
    const savedData = localStorage.getItem(signature);
    if(savedData)
      return Promise.resolve(JSON.parse(savedData))
    if(params.type==="search")
        return await axios.get("https://openlibrary.org/search.json",{
            params
        }).then(res=>{
            const data = res.data.docs.map((item)=>{
                return {
                    "Title and Sub Title":item?.title ?? item?.title_suggest ?? "Unknown",
                    "Author":item?.author_name?.[0] ?? "Unknown",
                    "Latest Publish Year":(item?.publish_year?.[item.publish_year.length-1]?? 'unknown')?.toString(),
                    "First Publish Year":(item?.first_publish_year ?? 'unknown')?.toString(),
                }
        })
        localStorage.setItem(signature,JSON.stringify(data))
        return data
    })

    else if(params.type==="subject"){
        let q= params.q
        q=q.split(' ').join("_").toLowerCase()
        return await axios.get("https://openlibrary.org/subjects/"+q+".json?limit=10").then(res=>{
            const data = res.data.works.map((item)=>{
                return {
                    "Title and Sub Title":item?.title ??  "Unknown",
                    "Author":item?.authors?.[0]?.name ?? "Unknown",
                    "Latest Publish Year":(item?.first_publish_year ?? 'unknown')?.toString(),
                    "First Publish Year":(item?.first_publish_year ?? 'unknown')?.toString(),
                }
            })
        localStorage.setItem(signature,JSON.stringify(data))
        return data
    })
    }

    throw new Error("something went wrong")
}
const useSearchSubject=()=>{
    const {addError}=useContext(MessageContext)
    const {mutate,isLoading,data,error}=useMutation(searchSubjectAPI,{
        onError:(err)=>{
            addError(err.message)
        }
    })
    return {mutate,isLoading,data,error}
}

export default useSearchSubject