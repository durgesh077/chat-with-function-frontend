import React, { useEffect,useState,useContext, useLayoutEffect } from 'react'
import { useSearchParams,Routes,Route,useNavigate,useLocation } from 'react-router-dom';
import SearchBox from '../../components/SearchBox/SearchBox';
import styles from './rightShow.module.scss'
import DetailsTable from '../../components/DetailsTable/DetailsTable';
import useSearchSubject from '../../customHooks/useSearchSubject';
import { MessageContext } from '../../components/MessageStack/MessageStack';
import Loader from '../../components/Loader/Loader';
function RightShow({setModal,subscription , payment,setEnrollrollState, ...props}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const {addError,addSuccess} = useContext(MessageContext);
  const {mutate,isLoading,data:result,error} = useSearchSubject();
  const [value, setValue] = useState("");
  const [offset,setOffset] = useState(0);
  const location = useLocation();
  const type = searchParams.get('type')
  const name = searchParams.get('name');
 
  useEffect(()=>{  
    setOffset(0)
  },[type, name])

  useEffect(()=>{    
    if(type && name)
      mutate({type,q:name,limit:10,offset,decending:true }, {
        onSuccess:(data)=>{
          if(data && Array.isArray(data) && data.length===0){
            setData(null)
            addError('No data found')
          }
        }
      })
    else{
      setData(null)
      navigate('/')
      return
    }
  },[offset,type, name])

  useEffect(()=>{
      if(result && Array.isArray(result) && result.length>0){
        setData(result)
      }
  },[result])

  const navigate = useNavigate()
  const [orderBy, setOrderBy] = useState(null)
  const [data, setData] = useState(null);
  
  function changeOrder(value){
    let dt=data.sort((d1,d2)=>{
      if(d1[value].toLowerCase()>d2[value].toLowerCase()) return 1;
      if(d1[value].toLowerCase()<d2[value].toLowerCase()) return -1;
      return 0;
    });
    setOrderBy(value)
    setData([...dt])
  }

  function onEnter(value){
    navigate('/?name='+value+'&type=search')
  }

  function changePrevious(){
    if(offset===0) {
      addError('No more previous data')
      return;
    };
    setOffset(offset-10)
  }
  function changeNext(){
    if(data.length<10){
      addError('No more data')
      return;
    }
    setOffset(offset+10)
  }
  return (
    <div className={styles.RightShow}>
          <div className={styles.top}>
            {
              type==='subject' ?
                <h2 className={styles.h2}>{searchParams.get('name')} &nbsp;
                <span className={styles.cut} onClick={()=>navigate('/')}>&times;</span></h2>
                :
                type === 'search' ?
                <SearchBox className = {styles.searchBox} onEnter={onEnter} placeholder='Search Book by title or By Author'/>
                :
                <SearchBox className = {styles.searchBox} onEnter={onEnter} placeholder='Search Book by title or By Author'/>
            }
            {/* <Routes>
              <Route exact path="/subject" element={
                <h2 className={styles.h2}>{searchParams.get('name')} &nbsp;
                <span className={styles.cut} onClick={()=>navigate('/')}>&times;</span></h2>
              } />
              <Route exact path="/search" element={
                  <SearchBox className = {styles.searchBox} onEnter={onEnter} placeholder='Search Book by title or By Author'/>
                } />
              <Route exact path="/" element={
                  <SearchBox className = {styles.searchBox} onEnter={onEnter} placeholder='Search Book by title or By Author'/>
                } />
            </Routes> */}
            </div>
        <div className={styles.bottom}>
                <DetailsTable orderBy={orderBy} data = {data} changeOrder={changeOrder}/>
                {data && type==='search' && 
                  <div className={styles.control}>
                      <button className={styles.previous} onClick={changePrevious} disabled={offset===0 || isLoading}>Previous</button>
                      <button className={styles.next} onClick={changeNext} disabled={data.length<10 || isLoading}>Next</button>
                  </div>
                }
        </div>
        <Loader loading={isLoading}/>
    </div>
  )
}

export default RightShow;
