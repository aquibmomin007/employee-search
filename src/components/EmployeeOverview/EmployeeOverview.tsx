
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

    const [employeeData, setEmployeeData] = useState<TreeNode | null>(null)

    useEffect(() => {
        if (guid) {
            fetchEmployeesInOrgChart(guid)
                .then(result => {
                    setEmployeeData(result)
                })
        }
    }, [guid])

    const showNode = ({value, children}: TreeNode, count: number, isRoot?: boolean) => {
        return (
            <span className={styles.employeeRootSpan}>
                {isRoot ? 
                    <h4 className={styles.employeeRootEmployee}>{value.name} 
                        <span className={styles.employeeDesig}>{` (${value.designation})`}</span>
                    </h4> : 
                    <span className={styles.employeeNormalEmployee}>
                        <span className={styles.employeeDash} style={{width: `${count * 2}px`}}></span> 
                            {value.name} 
                        <span className={styles.employeeDesig}>{` (${value.designation})`}</span>
                    </span>
                }
                {children.map(
                    (c, i) =>
                    <div style={{marginLeft: `${count}%`}} key={i}>{showNode(c, count + 10)}</div>
                )}
            </span>
        )
    }

    const handleGoBackToSearch = useCallback(() => {    
        history.push(`/`);
    }, [history])

    return (
        <div className={styles.employeeContainer}>
            <div className={styles.employeeOverviewBackBtn}>
                <button className={styles.employeeBtn} onClick={handleGoBackToSearch}>Back to Search</button>
            </div>
            <h3>Employee Overview</h3>
            {employeeData && (
                <div className={styles.employeeOverviewListBlock}>
                    {showNode(employeeData, 10, true)}
                </div>
            )}
        </div>
    )
}

export default EmployeeOverview;