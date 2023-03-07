import React, { useState } from 'react';
import styles from './PromptBox.module.scss';

const PromptBox = ({ message, callback }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      callback(inputValue);
    }
  };

  return (
        <div className={styles.prompt}>
            <div className={styles['prompt-box']}>
                <div>{message}</div>
                <input type="text" value={inputValue} onChange={handleInput} onKeyPress={handleEnter} />
                <button onClick={() => callback(inputValue)}>OK</button>
            </div>
        </div>
  );
};

export default PromptBox;
