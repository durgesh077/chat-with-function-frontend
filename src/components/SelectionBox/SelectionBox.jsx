import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize,faWindowMaximize, faUpload, faCancel, faRemove, faTrash, faTrashAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import styles from "./SelectionBox.module.scss";
import ContextMenu from "../ContextMenu/ContextMenu";
import PromptBox from "../PromptBox/PromptBox";

const SelectionBox = ({ title, selections , removeItems, deployItems }) => {
  const [isMinimized , setIsMinimized] = useState(false);
  const [position, setPosition] = useState({
    x: 10,
    y: 10,
  });
  const [dragging, setDragging] = useState(false);
  const [boxRef, setBoxRef] = useState(null);

  const handleMouseDown = (event) => {
    setDragging(true);
  };

  const handleMouseUp = (event) => {
    setDragging(false);
  };

  const handleMouseMove = (event) => {
    if (dragging && boxRef) {
      setPosition({
        x: Math.max(0, window.innerWidth - event.clientX - boxRef.offsetWidth),
        y: Math.max(0, window.innerHeight -  event.clientY - boxRef.offsetHeight),
      });
    }
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  });

  useEffect(() => {
    const handleResize = () => {
      setPosition({
        x: Math.max(0, boxRef.offsetWidth),
        y: Math.max(0, boxRef.offsetHeight),
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const handleMinimize = () => {
      if (!isMinimized) {
          boxRef.classList.add(styles.minimized);
          boxRef.style.width = '40px';
          setIsMinimized(true);
    } else {
        boxRef.classList.remove(styles.minimized);
        setIsMinimized(false);
    }
  };
  
  const handleResize = (event) => {
      event.preventDefault();
      const currentLoc_x = event.clientX;
      const currentLoc_y = event.clientY;
      const handleResizeDrag = (event) => {
            const newLoc_x = event.clientX;
            const newLoc_y = event.clientY;
            const width = boxRef.offsetWidth;
            const height = boxRef.offsetHeight;
            const newWidth =  width + (newLoc_x - currentLoc_x);
            const newHeight =  height + (newLoc_y - currentLoc_y);
            boxRef.style.width = `${newWidth}px`;
            boxRef.style.height = `${newHeight}px`;
        }
        const handleResizeMouseUp = () =>{
            window.removeEventListener('mousemove',handleResizeDrag);
            window.removeEventListener('mouseup',handleResizeMouseUp);
        }
        window.addEventListener('mousemove', handleResizeDrag);
        window.addEventListener('mouseup',handleResizeMouseUp);
  };

  const selectMenu = (option , id = null)=>{
    const ids = id?[id]: selections.map(([name , id])=>id);
    switch(option){
        case 'delete':
          removeItems(ids);
          break;
        case 'deploy':
          deployItems(ids);
          break;
        default:
          console.log("default:", ids);
    }
          
  }
  return (
    <div
      ref={setBoxRef}
      className={styles.selectionBox}
      style={{ bottom: position.y, right: position.x }}
    >
      <div className={styles.header}  onMouseDown={handleMouseDown}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.options}>
            <FontAwesomeIcon icon= {faUpload} title="Deploy" className={styles.menuItem}
                onClick={
                  (event)=>{
                      event.preventDefault();
                      event.stopPropagation();
                      selectMenu('deploy');
                    }
                  }/>
                  <PromptBox message={"are you sure to delete"} callback={()=>selectMenu('delete')}/>
            <FontAwesomeIcon icon= {faTrashAlt} title="Delete" className={styles.menuItem} 
                onClick={
                  (event)=>{
                      event.preventDefault();
                      event.stopPropagation();
                    }
                  }/>
        </div>
        <button className={styles.minimizeButton} onClick={handleMinimize}>
          {
            isMinimized ?
            <FontAwesomeIcon icon={faWindowMaximize} title={"maximize"}/>
            :<FontAwesomeIcon icon={faWindowMinimize} title={"minimize"}/>
          }
        </button>
      </div>
      <div className={styles.selections}>
        <ul className={styles.selectionList}>
          {selections.map(([name , id], index) => (
            <ContextMenu key={index} options={["deploy","delete"]} onSelect={(option)=>selectMenu(option , id)}>
              <li  className={styles.selectionItem}>
                    <span>{name}</span>
                </li>
            </ContextMenu>
          ))}
        </ul>
      </div>
      <div className={styles.resizeHandle} onMouseDown={handleResize} />
    </div>
  );
};

export default SelectionBox;
