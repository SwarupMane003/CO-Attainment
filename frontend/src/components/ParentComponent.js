import React, { useEffect, useState } from 'react';
// import FormComponent from './FormComponent';
import DataTable from './DataTable';
import Main_table from './main_table';
import { ContextProvider, UseData } from "../NewContext";
import { Button } from 'react-bootstrap';
// import ExcelImporter from '../../backUp/ExcelImporter';

const ParentComponent = ({tableName}) => {
    const {showbtn, setShowbtn} = UseData();
    const {showTable, setShowTable}= UseData();
    // const {createTables}=UseData();
    // const {next,setNext}=UseData();
    // const {createTable}=UseData();
    useEffect(()=>{
        // console.log(showbtn);
        // console.log(showTable);
    })
    return (
        
        <div>
            {showbtn    && (<DataTable tableName={tableName} />)}
            {showTable  && (<Main_table tableName={tableName} />)     }
        </div>
    );
};

export default ParentComponent;
