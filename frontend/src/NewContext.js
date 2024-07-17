import { createContext, useContext, useState } from 'react';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export const Context = createContext();

export const ContextProvider = ({ children }) => {

  // this hook to save selected test value (because we can not pass object hook. you may use arry of hook)  
  const [valuefortest1, setValuefortest1] = useState();

  // this hook to be set in level.js and used in below_table.js
  const [countLevelOneUT, setCountLevelOneUT] = useState();
  const [countLevelOneUA, setCountLevelOneUA] = useState();
  const [countLevelTwoUT, setCountLevelTwoUT] = useState();
  const [countLevelTwoUA, setCountLevelTwoUA] = useState();

  const [countLevelThreeUT, setCountLevelThreeUT] = useState();
  const [countLevelThreeUA, setCountLevelThreeUA] = useState();


  // this hook to store toggle button of show result
  const [resultState, setResultState] = useState(false);


  const [valueforacadamicyearlabel, setValueForAcademicYearlabel] = useState();
  const [valuefordepartmentlabel, setvaluefordepartmentlabel] = useState();
  const [valueforyearlabel, setvalueforyearlabel] = useState();
  const [valueforacadamicyear, setValueForAcadamicYear] = useState();
  const [valueforsubjectlabel, setvalueforsubjectlabel] = useState();
  const [valueforsemlabel, setvalueforsemlabel] = useState();
  const [valuefordivisionlabel, setValuefordivisionlabel] = useState();
  const [data, setData] = useState([]);

  //sending email fron forgotpass to verifyotp
  const [email, setEmail] = useState('');

  //sending name in navbar login to navbar
  const [name, setName] = useState();

  // check logged in ore not
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const [valueForRole, setValueForRole] = useState('');

  const [valueForMaxMarks, setValueForMaxMarks] = useState({
    CO_1: 15,
    CO_2: 15,
    CO_3: 15,
    CO_4: 15,
    CO_5: 15,
    CO_6: 15
  });
  const [flagForMainTable,setFlagForMainTable]=useState(false);
  const [showbtn, setShowbtn] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const createTable = async (tableName) => {
    console.log("context");
    try {
      // setShowbtn(true);
      console.log("valuetest1", valuefortest1);
      console.log("valueacadamicyear", valueforacadamicyearlabel);
      const response = await axios.get(
        `http://localhost:3000/createTable/${tableName}/${valueforyearlabel}/${valuefordepartmentlabel}/${valuefordivisionlabel}`
      );
      console.log(response);
      if (response.data.length === 0) {
        // Display toast notification for empty table
        toast.warn("Table is empty. Upload to the database.");
      } else if (response.status === 200) {
        if (response.data === "Table created successfully.") {
          // Table created successfully, show success notification
          toast.success("Table Created Successfully. Enter Data.");
        } else {
          // Table data fetched successfully, show success notification
          toast.success("Data Fetched Successfully.");
          // Handle table data if needed
          if (response.data.length === 0) {
            // Display toast notification for empty table
            toast.warning("Table is empty. Upload to the database.");
          } else {
            const updatedData = response.data.map((row) => {
              const totalUT1 = (row["UT1-Q1"] !== null && row["UT1-Q2"] !== null) ? row["UT1-Q1"] + row["UT1-Q2"] : null;
              const totalUT2 = (row["UT2-Q1"] !== null && row["UT2-Q2"] !== null) ? row["UT2-Q1"] + row["UT2-Q2"] : null;
              const totalUT3 = (row["UT3-Q1"] !== null && row["UT3-Q2"] !== null) ? row["UT3-Q1"] + row["UT3-Q2"] : null;
              return {
                ...row,
                ["Total-UT1"]: totalUT1,
                ["Total-UT2"]: totalUT2,
                ["Total-UT3"]: totalUT3,
              };
            });

            setData(updatedData);
            console.log(updatedData)

            // console.log(data)
          }
        }
      } else {
        // Unexpected response, handle it
        console.error("Unexpected response:", response);
        // Handle unexpected response if needed
      }
    } catch (error) {
      console.error("Error creating table:", error);
      // Handle error if needed
    }
  };
  

  // to select pattern
  const [valueforpattern, setValueforpattern] = useState("");

  // select Acadmic Year.
  // const {valueforacadamicyear, setValueForAcadamicYear} = UseData();

  //to select year.
  const [valueforyear, setValueforyear] = useState("");

  // for department
  const [valuefordepartment, setValuedepartment] = useState("");

  // useState for All divisions initial state is object
  // const [valuefordivisionArray, setValuefordivisionArray] = useState([]);
  // this to use usestate for addition for subject selection
  const [valuefordivision, setValuefordivision] = useState("");

  // to select semester and initialsing it by array
  // const [valueforsemArray, setValueforsemArray] = useState([]);
  // this useState for addition to find subject
  const [valueforsem, setValueforsem] = useState("");

  // useState for Subject contaning initial value as object.
  // const [valueforsubjectArray, setValueforsubjectArray] = useState([]);
  // to is actual setValue for subject selection
  const [valueforsubject, setValueforsubject] = useState();

    // // this hook for test selection like ut 1 ut2
    const [valuefortest, setValuefortest] = useState();
    const [tableName, setTableName] = useState();
    const [next,setNext]=useState(false);
//   const createTables = async () => {
       
//     const tableName = `${valueforpattern?.value}_${valueforacadamicyear?.value}_${valueforyear?.value}_${valuefordepartment?.value}_${valueforsem?.value}_${valueforsubject?.value}`;
//     if (
//         valueforpattern &&
//         valueforacadamicyear&&  
//         valueforyear &&
//         valuefordepartment &&
//         valuefordivision &&
//         valueforsem &&
//         valueforsubject &&
//         valuefortest
//     ) {
       
//         setTableName(tableName);
//         try {
            
//             console.log(tableName);
//             const response = await axios.get(
//                 `http://localhost:3000/createTable/${tableName}/${valueforyearlabel}/${valuefordepartmentlabel}/${valuefordivisionlabel}
//             `);
//             setShowbtn(true);
//             setNext(false);
//             if (response.data.length === 0) {
                
//                 // Display toast notification for empty table
//                 toast.warn("Table is empty. Upload to the database.");
//             } else if (response.status === 200) {
//                 console.log(response.data);
//                 if (response.data === "Table created successfully.") {
                    
//                     // Table created successfully, show success notification
//                     toast.success("Table Created Successfully. Enter Data.");
//                     // await createTable(tableName);
//                 } else {
//                     setData(response.data)
//                     setShowTable(true);
//                     await createTable(tableName);
//                 }
//             } else {
//                 // Unexpected response, handle it
//                 console.error("Unexpected response:", response);
//                 // Handle unexpected response if needed
//             }
//         } catch (error) {
//             console.error("Error creating table:", error);
//             // Handle error if needed
//         }
//     } else {
//         // Display toast notification for missing fields
//         toast.error("Please select all fields");
//         }

//     console.log("this is inside create");
//     };


  return (
    <Context.Provider value={{
      valuefortest1, setValuefortest1,
      countLevelOneUT, setCountLevelOneUT,
      countLevelOneUA, setCountLevelOneUA,
      countLevelTwoUT, setCountLevelTwoUT,
      countLevelTwoUA, setCountLevelTwoUA,
      countLevelThreeUT, setCountLevelThreeUT,
      countLevelThreeUA, setCountLevelThreeUA,
      resultState, setResultState,
      valueforacadamicyearlabel, setValueForAcademicYearlabel,
      valuefordepartmentlabel, setvaluefordepartmentlabel,
      valueforyearlabel, setvalueforyearlabel,
      valueforsubjectlabel, setvalueforsubjectlabel,
      valueforsemlabel, setvalueforsemlabel,
      valuefordivisionlabel, setValuefordivisionlabel,
      valueForMaxMarks, setValueForMaxMarks,
      data, setData,
      email, setEmail,
      name, setName,
      loggedInUserName, setLoggedInUserName,
      valueForRole, setValueForRole,
      createTable,
      valueforacadamicyear, setValueForAcadamicYear,
      flagForMainTable,setFlagForMainTable,
      showTable, setShowTable,
      showbtn, setShowbtn,
      valueforpattern, setValueforpattern,
      valueforyear, setValueforyear,
      valuefordepartment, setValuedepartment,
      valuefordivision, setValuefordivision,
      valueforsem, setValueforsem,
      valueforsubject, setValueforsubject,
      valuefortest, setValuefortest,
      tableName, setTableName,
      // createTables,
      next,setNext,
    }}>
      {children}
    </Context.Provider>
  )
}

export const UseData = () => {
  return useContext(Context);
}

export default ContextProvider
