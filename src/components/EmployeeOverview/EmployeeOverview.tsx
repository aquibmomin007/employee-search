
import React, { useState, useCallback, useEffect} from 'react';
import { fetchEmployeesInOrgChart, TreeNode } from '../../helpers/tree';
import styles from './EmployeeOverview.module.scss';
import { useHistory } from "react-router-dom";

const EmployeeOverview = (props:any) => { 
    const {
        match: {
          params: { guid },
        },
      } = props;
      const history = useHistory();

      console.log({guid})

    const [employeeData, setEmployeeData] = useState<TreeNode | null>(null)

    useEffect(() => {
        if (guid) {
            fetchEmployeesInOrgChart(guid)
                .then(result => {
                    setEmployeeData(result)
                })
        }
    }, [guid])

    const getDashes = (count:number) => {
        console.log({count})
        let dash = '|';
        for(let i=0; i < count/10; i++){
            dash += '__'
        }
        return dash;
    }

    const showNode = ({value, children}: TreeNode, count: number, isRoot?: boolean) => {
        const dashStr = getDashes(count);
        return (
            <span>
                {isRoot ? 
                    <h4 className={styles.employeeRootEmployee}>{value.name} <span className={styles.employeeDesig}>{`(${value.designation})`}</span></h4> : 
                    <span className={styles.employeeNormalEmployee}><span className={styles.employeeDash}>{dashStr}</span> {value.name} <span className={styles.employeeDesig}>{`(${value.designation})`}</span></span>}
                {children.map(
                    (c, i) =>
                    <div style={{marginLeft: `${count + 50}px`}} key={i}>{showNode(c, count + 10)}</div>
                )}
            </span>
        )
    }

    const handleGoBackToSearch = useCallback(() => {    
        history.push(`/`);
    }, [history])

    return (
        <>
        <button onClick={handleGoBackToSearch}>Back to Search</button>
        <div className={styles.employeeContainer}>
            <h3>Employee Overview</h3>
            {employeeData && (
                <div className={styles.EmployeeOverviewListBlock}>
                    {showNode(employeeData, 10, true)}
                </div>
            )}
        </div>
       </> 
    )
}

export default EmployeeOverview;