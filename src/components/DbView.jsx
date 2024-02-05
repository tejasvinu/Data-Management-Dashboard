import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Modal, Button, Form } from 'react-bootstrap';

function DbView() {
    const [tableData, setTableData] = useState([]);
    const [newRow, setNewRow] = useState({});
    const [showInsertModal, setShowInsertModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const { id } = useParams(); // Extract the ID parameter from the URL
    const dbType = new URLSearchParams(window.location.search).get('dbType');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData(); // Fetch data initially
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/${getApiParam()}${id}`);
            const data = response.data.fileName;
            const newdata = JSON.parse(data);
            console.log(newdata);
            setTableData(newdata);
            setIsLoading(false);
        } catch (error) {
            setError(error);
            setIsLoading(false);
        }
    };

    const getApiParam = () => {
        if (dbType === 'mysql') {
            return 'mysql-data/view/';
        } else if (dbType === 'mongo') {
            return 'mongo-data/view/';
        }
    };

    const handleCloseInsertModal = () => {
        setShowInsertModal(false);
        setNewRow({}); // Reset newRow state
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setNewRow({}); // Reset newRow state
        setSelectedRowId(null); // Reset selectedRowId state
    };

    const handleShowInsertModal = () => {
        setShowInsertModal(true);
    };

    const handleShowEditModal = (rowId) => {
        setSelectedRowId(rowId); // Set the selected row ID for editing
        const selectedRow = tableData.find(row => row.id === rowId);
        setNewRow(selectedRow); // Populate the newRow state with the selected row's data
        setShowEditModal(true); // Show the modal for editing
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewRow({ ...newRow, [name]: value });
    };

    const handleAddRow = async () => {
        try {
            await axios.post(`http://localhost:8080/api/${getApiParam()}${id}`, newRow);
            setNewRow({});
            handleCloseInsertModal();
            fetchData(); // Refresh data after adding new row
        } catch (error) {
            console.error('Error adding row:', error);
        }
    };

    const handleDeleteRow = async (row) => {
        try {
            await axios.delete(`http://localhost:8080/api/${getApiParam()}${id}`, { data: row });
            fetchData(); // Refresh data after deleting row
        } catch (error) {
            console.error('Error deleting row:', error);
        }
    };

    const handleUpdateRow = async () => {
        try {
            await axios.put(`http://localhost:8080/api/${getApiParam()}${id}`, newRow);
            setNewRow({}); // Clear newRow state
            setSelectedRowId(null); // Clear selected row ID
            handleCloseEditModal(); // Close the modal after updating
            fetchData(); // Refresh data after updating row
        } catch (error) {
            console.error('Error updating row:', error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Table Data</h2>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <table className="table table-striped">
                <thead>
                    <tr>
                        {Object.keys(tableData[0] || {}).map((heading, index) => (
                            <th key={index} scope="col">{heading}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {Object.keys(row).map((key, colIndex) => (
                                <td key={colIndex}>{Array.isArray(row[key]) ? row[key].join(", ") : String(row[key])}</td>
                            ))}
                            <td>
                                <button className="btn btn-danger" onClick={() => handleDeleteRow(row)}>Delete</button>
                                <button className="btn btn-primary ms-2" onClick={() => handleShowEditModal(row.id)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button variant="primary" onClick={handleShowInsertModal}>
                Add New Row
            </Button>

            <Modal show={showInsertModal} onHide={handleCloseInsertModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Row</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {Object.keys(tableData[0] || {}).map((key) => (
                            <Form.Group key={key} controlId={key}>
                                <Form.Label>{key}</Form.Label>
                                <Form.Control type="text" name={key} value={newRow[key] || ''} onChange={handleInputChange} />
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseInsertModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddRow}>
                        Add Row
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Row</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {Object.keys(newRow).map((key) => (
                            <Form.Group key={key} controlId={key}>
                                <Form.Label>{key}</Form.Label>
                                <Form.Control type="text" name={key} value={newRow[key] || ''} onChange={handleInputChange} />
                            </Form.Group>
                        ))}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateRow}>
                        Update Row
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default DbView;
