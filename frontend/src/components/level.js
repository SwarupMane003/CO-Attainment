import React, { Children, useEffect, useState } from "react";
import { UseData } from "../NewContext";
import axios from "axios";
import { Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
const Level = ({ tableName }) => {
  const [countLevelOne, setCountLevelOne] = useState({
    UT: 0,
    UA: 0,
  });

  const [averageData1, setAverageData1] = useState({});

  const [countLevelTwo, setCountLevelTwo] = useState({
    UT: 0,
    UA: 0,
  });

  const [countLevelThree, setCountLevelThree] = useState({
    UT: 0,
    UA: 0,
  });
// to change button
  const [isHovered, setIsHovered] = useState(false);
  // from NewContext.js and value modified i.e set not used
  const{valueforacadamicyear, setValueForAcadamicYear}=UseData();
  const { countLevelOneUT, setCountLevelOneUT } = UseData();
  const { countLevelOneUA, setCountLevelOneUA } = UseData();

  const { countLevelTwoUT, setCountLevelTwoUT } = UseData();
  const { countLevelTwoUA, setCountLevelTwoUA } = UseData();

  const { countLevelThreeUT, setCountLevelThreeUT } = UseData();
  const { countLevelThreeUA, setCountLevelThreeUA } = UseData();

  const { valueforacadamicyearlabel, setValueForAcademicYearlabel } = UseData();
  const {flagForMainTable,setFlagForMainTable}=UseData();
  
  const handleOnChange = (level, key, value1) => {
    let value=Number(value1);
    value=Math.min(100,value);
    switch (level) {
      case 1:
        if (key == "UT") {
          setCountLevelOneUT(value);
        } else {
          setCountLevelOneUA(value);
        }
        break;
      case 2:
        if (key == "UT") {
          setCountLevelTwoUT(value);
        } else {
          setCountLevelTwoUA(value);
        }
        break;
      case 3:
        if (key == "UT") {
          setCountLevelThreeUT(value);
        } else {
          setCountLevelThreeUA(value);
        }
        break;
      default:
        break;
    }
    setFlagForMainTable(false);
  };
  
  
  useEffect(() => {
    // calculate_average();
    countLevel();
  }, []);


  // const calculate_average = async () => {
  //   try {
  //     // Validate academicYear
  //     const academicYear = valueforacadamicyearlabel;
  //     if (!academicYear) {
  //       console.error("Academic year is not defined");
  //       return;
  //     }

  //     // Split the academic year and validate
  //     const academicYearParts = academicYear.split("-");
  //     if (academicYearParts.length !== 2) {
  //       console.error("Invalid academic year format");
  //       return;
  //     }

  //     const startingYear = parseInt(academicYearParts[0], 10);

  //     // API call and data processing
  //     const response = await axios.get(
  //       `http://localhost:3000/average_attainment_pastYears/${tableName}/${startingYear}`
  //     );

  //     const rows = response.data;
  //     let sumUA60 = 0;
  //     let sumUA66 = 0;
  //     let sumUAPass = 0;
  //     let sumUT60 = 0;
  //     let sumUT66 = 0;
  //     let sumUTPass = 0;
  //     rows.forEach((row) => {
  //       sumUA60 += row.UA_60;
  //       sumUA66 += row.UA_66;
  //       sumUAPass += row.UA_PASS;
  //       sumUT60 += row.UT_60;
  //       sumUT66 += row.UT_66;
  //       sumUTPass += row.UT_PASS;
  //     });

  //     const numRows = rows.length;

  //     const averageData = {
  //       averageUA60: sumUA60 / numRows + 2,
  //       averageUA66: sumUA66 / numRows + 2,
  //       averageUAPass: sumUAPass / numRows + 2,
  //       averageUT60: sumUT60 / numRows + 2,
  //       averageUT66: sumUT66 / numRows + 2,
  //       averageUTPass: sumUTPass / numRows + 2,
  //     };

  //     // Update contexts
  //     setCountLevelOneUA(averageData.averageUA66);
  //     setCountLevelOneUT(averageData.averageUT66);
  //     setCountLevelTwoUA(averageData.averageUA60);
  //     setCountLevelTwoUT(averageData.averageUT60);
  //     setCountLevelThreeUA(averageData.averageUAPass);
  //     setCountLevelThreeUT(averageData.averageUTPass);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     throw error;
  //   }
  // };
  const countLevel=async()=>{
    try{
      
      let year=valueforacadamicyear.label;
      
      const result=await axios.get(`http://localhost:3000/fetchAverageOfLevelFromYearwiseAttainment/${tableName}/${year}`);
      // console.log(result.data);
      if(!result.data['count']){
        setCountLevelOneUT(result.data['T_UT_PASS']);
        setCountLevelOneUA(result.data['T_UA_PASS']);
        setCountLevelTwoUT(result.data['T_UT_60']);
        setCountLevelTwoUA(result.data['T_UA_60']);
        setCountLevelThreeUT(result.data['T_UT_66']);
        setCountLevelThreeUA(result.data['T_UA_66']);
      }else{
        if(result.data['count']==0){
            setCountLevelOneUT(1);
            setCountLevelOneUA(1);
            setCountLevelTwoUT(1);
            setCountLevelTwoUA(1);
            setCountLevelThreeUT(1);
            setCountLevelThreeUA(1);
        }else{
  
          let x=result.data['UT_PASS']/result.data['count'];
          
          let x1=Math.round(x);
          // console.log(x1)
          setCountLevelOneUT(x1);
  
          x=result.data['UA_PASS']/result.data['count'];
          x1=Math.round(x);
          setCountLevelOneUA(x1);
  
          x=result.data['UT_60']/result.data['count'];
          x1=Math.round(x);
          setCountLevelTwoUT(x1);
  
          x=result.data['UA_60']/result.data['count'];
          x1=Math.round(x);
          // console.log(x)
          // console.log(x1);
          setCountLevelTwoUA(x1);
  
          x=result.data['UT_66']/result.data['count'];
          x1=Math.round(x);
          setCountLevelThreeUT(x1);
  
          x=result.data['UA_66']/result.data['count'];
          x1=Math.round(x);
          setCountLevelThreeUA(x1);
          // console.log(x1);
          
        } 
      }
      
    }catch(error){
      console.error('Error in getting data:', error);
    }
  }

  const updateLevel = async (e) => {
    e.preventDefault();
    try {
      let year = valueforacadamicyear.label;

      const response = await axios.post(`http://localhost:3000/postTargetInYearwiseAttainment/${tableName}/${year}`,{countLevelOneUT,
        countLevelOneUA,
        countLevelTwoUT,
        countLevelTwoUA,
        countLevelThreeUT,
        countLevelThreeUA});
      
      if (response.status === 200) {
        toast.success("Target updated successfully!");
        setFlagForMainTable(true);
        console.log(flagForMainTable);
      } else {
        throw new Error("Failed to update target");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Error updating target");
    }
  };
  

  
  return (
    <div className="level-container">
      <div style={{
  display: 'flex',
  alignItems: 'center',
  
}}>

      <table>
        <thead>
          <tr>
            <th></th>
            <th>UT</th>
            <th>UA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Level 3</td>
            <td>
              <input
                // type="number"
                defaultValue={countLevelThreeUT}
                onChange={(e) => handleOnChange(3, "UT", e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue={countLevelThreeUA}
                onChange={(e) => handleOnChange(3, "UA", e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Level 2</td>
            <td>
              <input
                type="number"
                defaultValue={countLevelTwoUT}
                onChange={(e) => handleOnChange(2, "UT", e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue={countLevelTwoUA}
                onChange={(e) => handleOnChange(2, "UA",e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Level 1</td>
            <td>
              <input            
                type="number"
                defaultValue={countLevelOneUT}
                onChange={(e) => handleOnChange(1, "UT",e.target.value)}
              />
            </td>
            <td>
              <input
                type="number"
                defaultValue={countLevelOneUA}
                onChange={(e) => handleOnChange(1, "UA", e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      {flagForMainTable ==false ?(<Button
    style={{
      width: "5vw",
      marginLeft: "10px",
      backgroundColor: isHovered ? "green" : "red",
    }}
    onMouseOver={() => setIsHovered(true)}
    onMouseOut={() => setIsHovered(false)}
    onClick={updateLevel}
  >
    Save Target
  </Button>):""}
      </div>
    </div>
  );
};
export default Level;