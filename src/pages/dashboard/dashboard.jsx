import React, { useEffect, useState } from 'react'
import { Link,useNavigate } from 'react-router-dom';
import SearchBox from '../../components/SearchBox/SearchBox';
import styles from './dashboard.module.scss'
let trendingItems=['Javascript', 'Harry Potter','Indian History','Crypto Currency','Criminal Law']
function Dashboard(props) {
  const navigate = useNavigate()
  const [trends, setTrends] = useState(trendingItems);
  function onEnter(value){
    trendingItems.unshift(value)
    trendingItems = Array.from(new Set(trendingItems))
    setTrends([...trendingItems])
    navigate('/?name='+value+'&type=subject')
  }
  return (
    <div className={styles.dashboard}>
        <h2 className={styles.trendingHeadline}>Trending Subjects</h2>
        <SearchBox onEnter={onEnter}  placeholder="Search Subjects"/>
        <ul className={styles.trendList}>
            {
                trends.map((item,index)=>{
                    return <li key={index} className={styles.trendingItem}>
                      <Link className={styles.subjectLink} to={`/?name=${item}&type=subject`}>{item} </Link>
                      </li>
                })
            }
        </ul>
    </div>
  )
}

export default Dashboard
