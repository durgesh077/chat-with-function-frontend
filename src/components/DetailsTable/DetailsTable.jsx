import styles from './DetailsTable.module.scss';
import React, { useEffect } from 'react';
function DetailsTableRow({attributes,data, changeOrder,orderBy,head=false}){
    return (
        head?
            <thead>
                {attributes.map((value, index) => (
                    <th key={index} onClick={()=>changeOrder(value)}>
                        {value}
                        {value===orderBy &&
                        <span className={styles.shiftRight}>^</span>
                        }
                        </th>
                ))}
            </thead>
        :
            <tr>
                {attributes.map((attribute, index) => (
                    <td key={index}>{data[attribute]}</td>
                ))}
            </tr>
    );
}
function DetailsTable({data, changeOrder,orderBy}){
    if(!Array.isArray(data) || data.length===0) return null;
    const attributes = Object.keys(data[0]);
    return (
        <table className={styles.table}>
            <DetailsTableRow attributes={attributes} changeOrder={changeOrder} orderBy={orderBy} head={true}/>
            <tbody>
                {data.map((item,index)=>(
                    <DetailsTableRow key={index} attributes={attributes} data={item}/>
                ))}
            </tbody>
        </table>
    )
}

export default DetailsTable;
