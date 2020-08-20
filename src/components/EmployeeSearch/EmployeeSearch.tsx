
import React, { useState, useCallback, useEffect} from 'react';
import styles from './EmployeeSearch.module.scss'
import { fetchEmployeesInOrgChart, TreeNode } from '../../helpers/tree';

type EmployeeSearchProps = {}

const EmployeeSearch = (props: EmployeeSearchProps) => { 
  const [searchText, setSearchText] = useState('');
  const [employeeData, setEmployeeData] = useState<TreeNode | null>(null)

  const handleSearch = useCallback((event) => {
    setSearchText(event.target.value)
  }, [])

  const handleSubmit = useCallback((event) => {
    if (searchText) {
        fetchEmployeesInOrgChart(searchText)
            .then(result => {
                console.log("result fetched :: ", result)
                setEmployeeData(result)
            })
    }
  }, [searchText])

    const showNode = (t: TreeNode) => {
        console.log(t.value, Array.from(t.children))
        return (
            <div>
                <span>{t.value}</span>
                {Array.from(t.children).map(c => showNode(c))}
            </div>
        )
    }

  return (
    <div>
        <div>
            <input type="text" placeholder="Search..." onChange={handleSearch} value={searchText}/>
            <button onClick={handleSubmit}>Search</button>
            <div>
                {employeeData ? showNode(employeeData) : false}
            </div>
        </div>
    </div>
  )
}

export default EmployeeSearch;