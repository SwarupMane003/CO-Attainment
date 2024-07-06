import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UseData } from '../NewContext';

const DivisionAndDepartment = () => {
    // State variables for dropdown values
    const [data, setData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);
    const [showInput, setShowInput] = useState(false);
    const [department, setDepartment] = useState('');
    const [degreeYear, setDegreeYear] = useState('');
    const [division, setDivision] = useState('');
    const [divisionCode, setDivisionCode] = useState('');

    useEffect(() => {
        // handleFetch();
    }, []);

    const handleFetch = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/fetch_department/${department}`);
            if (response.status === 200) {
                toast.success("Department and Divisions fetched successfully.");
                setDepartmentData(response.data);
            } else {
                toast.warn("Error in fetching data");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred while fetching data.");
        }
    };

    const handleRemove = async (divisionCode) => {
        try {
            const response = await axios.post(`http://localhost:3000/delete_department_division/${divisionCode}`);
            if (response.status === 200) {
                toast.success("Entry deleted successfully.");
                await handleFetch();
            } else {
                toast.warn("Error in deleting entry");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred while deleting the entry.");
        }
    };

    const handleAdd = () => {
        setShowInput(true);
    };

    const handleSave = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/add_department_division/${department}/${degreeYear}/${division}/${divisionCode}`);
            if (response.status === 200) {
                toast.success("Entry made successfully!");
                setDegreeYear('');
                setDivision('');
                setDivisionCode('');
                setShowInput(false);
                await handleFetch();
            } else {
                toast.warn("Internal Server Error");
            }
        } catch (error) {
            console.error('Error occurred:', error);
            toast.error("An error occurred while adding the entry.");
        }
    };

    const handleDepartmentChange = (e) => {
        setDepartment(e.target.value);
    };

    const handleDegreeYearChange = (e) => {
        setDegreeYear(e.target.value);
    };

    const handleDivisionChange = (e) => {
        setDivision(e.target.value);
    };

    const handleDivisionCodeChange = (e) => {
        setDivisionCode(e.target.value);
    };

    return (
        <>
            <div
                style={{
                    maxWidth: '400px',
                    margin: '76px auto',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
                }}
            >
                <h2>Edit Department & Division</h2>
                <label style={{ display: 'block', marginBottom: '8px' }}>Enter Department Abbreviation:</label>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Department"
                            value={department}
                            onChange={handleDepartmentChange}
                            style={{ width: '100%', padding: '8px', marginBottom: '16px', border: '1px solid #ccc' }}
                            required
                        />
                    </div>

                    <div>
                        <button
                            onClick={handleFetch}
                            style={{
                                backgroundColor: '#4caf50',
                                color: 'white',
                                marginTop: '10px',
                                padding: '10px 15px',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Add / Fetch
                        </button>
                    </div>
                </div>
            </div>
            <h1 style={{ textAlign: 'center' }}>Department Wise Divisions</h1>
            <div className="container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Department</th>
                            <th style={{ textAlign: 'center' }}>Degree Year</th>
                            <th style={{ textAlign: 'center' }}>Division</th>
                            <th style={{ textAlign: 'center' }}>Division Code</th>
                            <th style={{ textAlign: 'center' }}>Remove/Add</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departmentData.map((item, index) => (
                            <tr key={index}>
                                <td style={{ textAlign: 'center' }}>{item.Department}</td>
                                <td style={{ textAlign: 'center' }}>{item.Degree_Year}</td>
                                <td style={{ textAlign: 'center' }}>{item.Division}</td>
                                <td style={{ textAlign: 'center' }}>{item.Division_Code}</td>
                                <td style={{
                                    textAlign: 'center',
                                    cursor: 'pointer', // Add pointer cursor for better UX
                                }}
                                    onClick={() => handleRemove(item.Division_Code)}>
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
                                    <label
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    >
                                        {department}
                                    </label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={degreeYear}
                                        onChange={handleDegreeYearChange}
                                        placeholder="Enter Degree Year"
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={division}
                                        onChange={handleDivisionChange}
                                        placeholder="Enter Division"
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            height: '100%',
                                        }}
                                        required
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={divisionCode}
                                        onChange={handleDivisionCodeChange}
                                        placeholder="Enter division code"
                                        style={{
                                            textAlign: 'center',
                                            width: '100%',
                                            height: '100%',
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
                                        fontSize: '30px',
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

export default DivisionAndDepartment;
