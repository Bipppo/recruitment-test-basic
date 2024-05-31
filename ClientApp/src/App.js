import React, { useState, useEffect } from 'react';
import Collapsible from 'react-collapsible';

export default function () {

    //Keep track of the employee dataset
    const [employees, setEmployees] = useState([]);
    const [createName, setCreateName] = useState('');
    const [createValue, setCreateValue] = useState('');

    async function getEmployees() {
        return fetch("/employees").then(response => response.json());
    }

    useEffect(() => {
        async function getData(){
            const db_emp = await getEmployees();
            setEmployees(db_emp);
        }
        getData();
    }, []);


    async function createEmployee(name, value) {
        return fetch("/employees", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    async function updateEmployee(name, value) {
        return fetch("/employees", {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, value: value })
        });
    }

    const [updateName, setUpdateName] = useState('');
    const [updateValue, setUpdateValue] = useState('');

    //Runs when new employee is created
    async function onNewCreated(event){
        event.preventDefault();
        await createEmployee(createName, createValue);
        setEmployees(await getEmployees());
        setCreateName('');
        setCreateValue('');
    }

    //Handles new data coming in, updates the value to an existing name
    async function handleUpdate(event){
        event.preventDefault();
        await updateEmployee(updateName, updateValue);
        setEmployees(await getEmployees());
        setUpdateName('');
        setUpdateValue('');
    }

    return (
        <div style ={{ display:'flex', justifyContent:'center' }}>
            {/* Display Employee List as a table for a greater flexibility of display and functionalities */}
            <table>
                {/* Table Headers */}
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Value</th>
                        {/* Collapsible that allows employees to be updated. */}
                        <th><Collapsible trigger="Update Employee">
                                <form onSubmit={handleUpdate}>
                                    <input type="text" value={updateName} placeholder='New Name' onChange={(e) => setUpdateName(e.target.value)}></input>
                                    <input type="text" value={updateValue} placeholder='New Value' onChange={(e) => setUpdateValue(e.target.value)}></input>
                                    <button type = "submit">Submit Changes</button>
                                </form>
                            </Collapsible></th>
                    </tr>
                </thead>

                {/* Main table body to display each employee, using each employee's primary key for identification */}
                <tbody>
                    {employees.map((emp) => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Form to create new employee entry */}
            <h>Add New Employee</h>
            <form onSubmit={onNewCreated} style={{ flexDirection: 'column'}}>
                <input type = "text" value={createName} placeholder='Name' onChange={(e) => setCreateName(e.target.value)}></input>
                <input type = "text" value={createValue} placeholder='Value' onChange={(e) => setCreateValue(e.target.value)}></input><br />
                <button type = "submit">Create Employee</button>
            </form>

        </div>
    );
}
