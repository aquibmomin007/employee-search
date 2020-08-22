
import React, { useState, useCallback} from 'react';
import { fetchEmployeePresent } from '../../helpers/tree';
import styles from './EmployeeSearch.module.scss';
import { useHistory } from "react-router-dom";

const EmployeeSearch = () => { 
    const [searchText, setSearchText] = useState('');
    const [isNotFound, setIsNotFound] = useState(false);
    const history = useHistory();

    const handleSearch = useCallback((event) => setSearchText(event.target.value), [])

    const handleSubmit = useCallback(() => {
        setIsNotFound(false)
        if (searchText) {
            fetchEmployeePresent(searchText)
                .then(dataFound => {
                   if(!dataFound) {
                       setIsNotFound(true);
                   }
                   else{
                        history.push(`/overview/${searchText}`);
                   }
                })
        }
    }, [searchText, history])

    const handleEnterKeyPress = useCallback((event) => {
        if (event.charCode === 13) {
            handleSubmit()
        }   
    }, [handleSubmit])

    return (
        <div className={styles.employeeContainer}>
            <div>
                <h3>Employee Explorer</h3>
                <div className={styles.employeeSearchContainer}>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        onChange={handleSearch} 
                        value={searchText}
                        onKeyPress={handleEnterKeyPress}
                    />
                    <button 
                        className={styles.employeeBtn}
                        onClick={handleSubmit}
                        disabled={searchText === ''}
                    >
                        Search
                    </button>
                </div>
                {isNotFound ?  <div className={styles.employeeSearchNoResults}>No results found</div>: ''}
            </div>
        </div>
    )
}

export default EmployeeSearch;