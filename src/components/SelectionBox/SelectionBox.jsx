// import React, { useState, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faWindowMinimize,faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
// import styles from "./SelectionBox.module.scss";

// const SelectionBox = ({ selections }) => {
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//   const [position, setPosition] = useState({ x: 20, y: 20 });
//   const boxRef = useRef();
  
//   const handleMinimize = () => {
//     setIsMinimized(!isMinimized);
//   };

//   const handleDragStart = (event) => {
//     event.preventDefault();
//     setIsDragging(true);
//     setDragStart({ x: event.clientX, y: event.clientY });
//   };

//   const handleDrag = (event) => {
//     event.preventDefault();
//     if (isDragging) {
//       const x = event.clientX;
//       const y =  event.clientY;
//       setPosition({ x, y });
//       setDragStart({ x: 0, y: 0 });
//     }
//   };

//   const handleDragEnd = () => {
//     setIsDragging(false);
//   };

//   const boxStyles = {
//     right: `${window.innerWidth - position.x}px`,
//     bottom: `${window.innerHeight - position.y}px`
//   };

//   const handleSelectionClick = (event) => {
//     event.stopPropagation();
//     // Handle selection click logic here
//   };

//   return (
//     <div
//       className={`${styles.selectionBox} ${isMinimized ? styles.minimized : ""}`}
//       ref={boxRef}
//       style={boxStyles}
//       onMouseDown={handleDragStart}
//       onMouseMove={handleDrag}
//       onMouseUp={handleDragEnd}
//     >
//       <div className={styles.header}>
//         <h3 className={styles.title}>Selected Items</h3>
//         <button
//           className={styles.minimizeButton}
//           onClick={handleMinimize}
//           aria-label={isMinimized ? "Maximize" : "Minimize"}
//         >
//           { isMinimized? 
//                 <FontAwesomeIcon icon={faWindowMaximize}/>
//                 :<FontAwesomeIcon icon={faWindowMinimize}/>
//           }
//         </button>
//         <div className={styles.resizeHandle}></div>
//       </div>
//       <div className={styles.selections}>
//         <ul className={styles.selectionList}>
//           {selections.map((selection, index) => (
//             <li
//               key={index}
//               className={styles.selectionItem}
//               onClick={handleSelectionClick}
//             >
//               {selection}
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default SelectionBox;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize,faWindowMaximize } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import styles from "./SelectionBox.module.scss";

const SelectionBox = ({ title, selections }) => {
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
  return (
    <div
      ref={setBoxRef}
      className={styles.selectionBox}
      style={{ bottom: position.y, right: position.x }}
      onMouseDown={handleMouseDown}
    >
      <div className={styles.header} >
        <h2 className={styles.title}>{title}</h2>
        <button className={styles.minimizeButton} onClick={handleMinimize}>
          {
            isMinimized ?
            <FontAwesomeIcon icon={faWindowMaximize}/>
            :<FontAwesomeIcon icon={faWindowMinimize}/>
          }
        </button>
      </div>
      <div className={styles.selections}>
        <ul className={styles.selectionList}>
          {selections.map((selection, index) => (
            <li key={index} className={styles.selectionItem}>
              {selection}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.resizeHandle} onMouseDown={handleResize} />
    </div>
  );
};

export default SelectionBox;
