import React, { useContext, useEffect, useState } from 'react'
import styles from './Home.module.scss'
import Dashboard from '../dashboard/dashboard'
import RightShow from '../rightShow/rightShow'
const Home = () => {
    return (
        <div className={styles.home}>
            <Dashboard/>
            <RightShow/>
        </div>
    )
}

export default Home
