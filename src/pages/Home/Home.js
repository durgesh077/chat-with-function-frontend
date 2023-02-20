import React, { useContext, useEffect, useState } from 'react'
import styles from './Home.module.scss'
import Notebook from '../../components/Notebook/Notebook';
import DeployPanel from '../DeployPanel/DeployPanel';
import DeployedFunctionPanel from '../DeployedFunctionPanel/DeployedFunctionPanel';
const Home = () => {
    //choose any of the above prompts randomly

    return (
        <div className={styles.home}>
            <div className={styles.head}>
                <h1>Chat with Functions </h1>
            </div>

            <Notebook 
                Selectors={["Deployed functions","Deploy"]}
                Panels={[
                    <DeployedFunctionPanel/>,
                    <DeployPanel />]}
                />
        </div>
    )
    
}

export default Home
