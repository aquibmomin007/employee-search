
import React, { useState, useCallback} from 'react';
import { fetchEmployeesInOrgChart, TreeNode } from '../../helpers/tree';
import styles from './EmployeeSearch.module.scss';

const EmployeeSearch = () => { 
    const [searchText, setSearchText] = useState('');
    const [isDataFound, setIsDataFound] = useState(false);
    const [employeeData, setEmployeeData] = useState<TreeNode | null>(null)

    const handleSearch = useCallback((event) => setSearchText(event.target.value), [])

    const handleSubmit = useCallback(() => {
        setIsDataFound(false)
        if (searchText) {
            fetchEmployeesInOrgChart(searchText)
                .then(result => {
                   if(result === null) setIsDataFound(true);
                    setEmployeeData(result)
                })
        }
    }, [searchText])

    const showNode = ({value, children}: TreeNode, count: number, isRoot?: boolean) => {
        return (
            <span>
                {isRoot ? <h4 className={styles.employeeRootEmployee}>{value}</h4> : <span>{value}</span>}
                {children.map(
                    (c, i) =>
                        <div style={{marginLeft: `${count +10}px`}} key={i}>{showNode(c, count + 10)}</div>
                )}
            </span>
        )
    }

    console.log({employeeData})

    return (
        <div className={styles.employeeContainer}>
            <div className={styles.employeeSearchContainer}>
                <input type="text" placeholder="Search..." onChange={handleSearch} value={searchText}/>
                <button 
                    onClick={handleSubmit}
                    disabled={searchText === ''}
                >
                    Search
                </button>
                <div className={styles.employeeSearchListBlock}>
                    {employeeData ? 
                        showNode(employeeData, 10, true) : 
                        isDataFound ? 
                        <div className={styles.employeeSearchNoResults}>No results found</div>: ''
                    }
                </div>
            </div>
        </div>
    )
}

export default EmployeeSearch;