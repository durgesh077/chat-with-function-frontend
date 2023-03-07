import React, { useContext, useEffect, useState } from 'react'
import styles from './Home.module.scss'
import Notebook from '../../components/Notebook/Notebook';
import DeployPanel from '../DeployPanel/DeployPanel';
import DeployedFunctionPanel from '../DeployedFunctionPanel/DeployedFunctionPanel';
import Header from './Header/Header';
const Home = () => {
    const [prompts,setPrompts] = useState([]);
    return (
        <div className={styles.home}>
            <Header/>
            <Notebook 
                Selectors={["Deployed functions","Deploy"]}
                Panels={[
                    <DeployedFunctionPanel/>,
                    <DeployPanel prompts={prompts} setPrompts={setPrompts}/>]}
                /> 
        </div>
    )
    
}

export default Home
