import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UseData } from '../NewContext';

const EditSubject = () => {
    const [data, setData] = useState([]);
    const [valuefordepartmentArray, setValuedepartmentArray] = useState([]);
    const { valueforyearlabel, setvalueforyearlabel } = UseData();
    const { valuefordepartmentlabel, setvaluefordepartmentlabel } = UseData();
    const { valueforsemlabel, setvalueforsemlabel } = UseData();
    const [valueforsemArray, setValueforsemArray] = useState([]);
    const [valuefordepartment, setValuedepartment] = useState("");
    const [valueforsem, setValueforsem] = useState("");
    const [valueforyear, setValueforyear] = useState("");
    const [valueforpattern, setValueforpattern] = useState("");
    const [subjectData, setSubjectData] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [inputCode, setInputCode] = useState('');
    const [inputCourseAb, setInputCourseAb] = useState('');
    const [inputCourse, setInputCourse] = useState('');

    let patternnames = [];
    const [transformedPattern, setTransformedPattern] = useState([]);
    let departmentnames = [];
    const [transformedDepartment, setTransformedDepartment] = useState([]);

    useEffect(() => {
        transformPattern();
        transformDepartment();
    }, []);

    const transformPattern = async () => {
        await handleGetPattern();
        let transformedPatterns = patternnames.map(patternname => ({
            value: convertPattern(patternname),
            label: String(patternname.Pattern),
        }));
        setTransformedPattern(transformedPatterns);
    }

    const convertPattern = (pattern) => {
        return "p" + String(pattern.Pattern);
    }

    const transformDepartment = async () => {
        await handleGetDeparment();
        const transformedDepartments = departmentnames.map(departmentname => ({
            value: departmentname.Department.toLowerCase(),
            label: departmentname.Department
        }));
        setTransformedDepartment(transformedDepartments);
    }

    const handleGetPattern = async () => {
        try {
            const result = await axios.get("http://localhost:3000/pattern");
            if (result.status === 200) {
                patternnames = result.data;
            } else {
                console.error(`Error: Received unexpected status code ${result.status}`);
            }
        } catch (error) {
            console.log("Error while fetching data");
        }
    }

    const handleGetDeparment = async () => {
        try {
            const result = await axios.get("http://localhost:3000/department");
            if (result.status === 200) {
                departmentnames = result.data;
            } else {
                console.error(`Error: Received unexpected status code ${result.status}`);
            }
        } catch (error) {
            console.log("Error while fetching data");
        }
    }

    const yearname = [
        { value: "y1_d", label: "FE" },
        { value: "y2_d", label: "SE" },
        { value: "y3_d", label: "TE" },
        { value: "y4_d", label: "BE" },
    ];

    const fe = [
        { value: "sem1", label: "Sem_1" },
        { value: "sem2", label: "Sem_2" },
    ];

    const se = [
        { value: "sem3", label: "Sem_3" },
        { value: "sem4", label: "Sem_4" },
    ];

    const te = [
        { value: "sem5", label: "Sem_5" },
        { value: "sem6", label: "Sem_6" },
    ];

    const be = [
        { value: "sem7", label: "Sem_7" },
        { value: "sem8", label: "Sem_8" },
    ];

    const semname = { fe, se, te, be };

    useEffect(() => {
        handleFetch();
    }, []);

    const tableName = `${valueforpattern?.value}_${valueforyear?.value}_${valuefordepartment?.value}_${valueforsem?.value}`;

    const handleFetch = async () => {
        if (
            valueforpattern &&
            valueforyear &&
            valuefordepartment &&
            valueforsem
        ) {
            try {
                const response = await axios.get(`http://localhost:3000/fetch_subject/${tableName}`);
                if (response.status === 200) {
                    toast.success("Subject fetched successfully!");
                    setSubjectData(response.data);
                } else {
                    toast.warn("Error in fetching data");
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error("An error occurred while fetching data.");
            }
        } else {
            toast.error("Please select all fields!");
        }
    }

    const handleRemove = async (code) => {
        try {
            const response = await axios.post(`http://localhost:3000/delete_subject/${tableName}/${code}`);
            if (response.status === 200) {
                toast.success("Subject deleted successfully.");
                await handleFetch();
            } else if (response.data === 500 && response.status === "Error in deleting subject") {
                toast.warn("Error in deleting subject");
            }
        } catch (error) {
            console.error('Error removing subject:', error);
            toast.error("An error occurred while removing the subject.");
        }
    };

    const handleAdd = () => {
        setShowInput(true);
    };

    const handleInputCodeChange = (e) => {
        setInputCode(e.target.value);
    };

    const handleInputCourseAbChange = (e) => {
        setInputCourseAb(e.target.value);
    };

    const handleInputCourseChange = (e) => {
        setInputCourse(e.target.value);
    };

    const handleSave = async () => {
        if (valueforpattern &&
            valueforyear &&
            valuefordepartment &&
            valueforsem) {
            try {
                const response = await axios.post(`http://localhost:3000/add_subject/${tableName}/${inputCode}/${inputCourseAb}/${inputCourse}`);
                if (response.status === 200) {
                    toast.success("Course Added Successfully!");
                    setInputCode('');
                    setInputCourseAb('');
                    setInputCourse('');
                    setShowInput(false);
                    await handleFetch();
                } else if (response.status === 500 && response.data === "Internal Server Error") {
                    toast.warn("Internal Server Error");
                }
            } catch (error) {
                console.log('Error occurred: ', error);
                toast.error("An error occurred while adding the course.");
            }
        } else {
            toast.warn("Select all fields!");
        }
    };

    const dropdownStyle = {
        width: '250px',
        margin: '10px auto',
    };

    const buttonStyle = {
        backgroundColor: '#4caf50',
        color: 'white',
        marginTop: '10px',
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        width: '250px',
        textAlign: 'center'
    };

    return (
        <>
            <div
                style={{
                    maxWidth: '600px',
                    margin: '76px auto',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                    width: '500px'
                }}
            >
                <h2 style={{ textAlign: 'center' }}>Edit Subject</h2>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <label style={{ marginBottom: '20px' }}>
                        Pattern:
                        <Select
                            options={transformedPattern}
                            value={valueforpattern}
                            onChange={(selectedOption) => {
                                setValueforpattern(selectedOption);
                            }}
                            isSearchable
                            placeholder="Select Pattern"
                            required
                            styles={{ container: (provided) => ({ ...provided, ...dropdownStyle }) }}
                        />
                    </label>
                    <br />
                    <label style={{ marginBottom: '20px' }}>
                        Degree Year:
                        <Select
                            options={yearname}
                            value={valueforyear}
                            onChange={(selectedOption) => {
                                setValueforyear(selectedOption);
                                setvalueforyearlabel(selectedOption.label);
                                setValueforsemArray(semname[selectedOption.label.toLowerCase()]);
                            }}
                            isSearchable
                            placeholder="Select Year"
                            required
                            styles={{ container: (provided) => ({ ...provided, ...dropdownStyle }) }}
                        />
                    </label>
                    <br />
                    <label style={{ marginBottom: '20px' }}>
                        Department:
                        <Select
                            options={transformedDepartment}
                            value={valuefordepartment}
                            onChange={(selectedOption) => {
                                setValuedepartment(selectedOption);
                                setvaluefordepartmentlabel(selectedOption.label);
                            }}
                            isSearchable
                            placeholder="department"
                            required
                            styles={{ container: (provided) => ({ ...provided, ...dropdownStyle }) }}
                        />
                    </label>
                    <br />
                    <label style={{ marginBottom: '20px' }}>
                        Semester:
                        <Select
                            options={valueforsemArray}
                            value={valueforsem}
                            onChange={(selectedOption) => {
                                setvalueforsemlabel(selectedOption.label);
                                setValueforsem(selectedOption);
                            }}
                            isSearchable
                            placeholder="Select Semester"
                            required
                            styles={{ container: (provided) => ({ ...provided, ...dropdownStyle }) }}
                        />
                    </label>

                    <div>
                        <button
                            onClick={handleFetch}
                            style={buttonStyle}
                        >
                            Fetch
                        </button>
                    </div>
                </div>
            </div>
            <h1 style={{ textAlign: 'center' }}>Subjects</h1>
            <div className="container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Course Code</th>
                            <th style={{ textAlign: 'center' }}>Course Abbreviation</th>
                            <th style={{ textAlign: 'center' }}>Course Name</th>
                            <th style={{ textAlign: 'center' }}>Remove/Add</th>
                        </tr>
                    </thead>
                    <tbody>
                        {subjectData.map((item, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{item.Course_Code}</td>
                                <td style={{ textAlign: 'center' }}>{item.Subject_Name}</td>
                                <td style={{ textAlign: 'center' }}>{item.Course_Name}</td>
                                <td style={{
                                    textAlign: 'center',
                                    cursor: 'pointer', // Add pointer cursor for better UX
                                }}
                                    onClick={() => handleRemove(item.Course_Code)}>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'red',
                                        color: 'white',
                                        lineHeight: '40px', // Vertically center the X
                                    }}>X</span>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{
                                textAlign: 'center',
                                cursor: 'pointer', // Add pointer cursor for better UX
                            }}
                                onClick={handleAdd}>
                                <span style={{
                                    display: 'inline-block',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    backgroundColor: 'green',
                                    color: 'white',
                                    lineHeight: '35px', // Vertically center the +
                                    fontSize: '30px'
                                }}>+</span>
                            </td>
                        </tr>
                        {showInput && (
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        value={inputCode}
                                        onChange={handleInputCodeChange}
                                        placeholder="Enter course code"
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={inputCourseAb}
                                        onChange={handleInputCourseAbChange}
                                        placeholder="Enter course abbreviation"
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={inputCourse}
                                        onChange={handleInputCourseChange}
                                        placeholder="Enter course name"
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            height: '100%'
                                        }}
                                        required
                                    />
                                </td>
                                <td style={{
                                    textAlign: 'center',
                                    cursor: 'pointer', // Add pointer cursor for better UX
                                }}
                                    onClick={handleSave}
                                >
                                    <span style={{
                                        display: 'inline-block',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        backgroundColor: 'green',
                                        color: 'white',
                                        lineHeight: '40px', // Vertically center the ✓
                                        fontSize: '30px'
                                    }}>✓</span>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            <ToastContainer />
        </>
    );
};

export default EditSubject;
