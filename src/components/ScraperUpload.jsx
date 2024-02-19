import React, { useState } from 'react';
import axios from 'axios';

function ScraperUploadComponent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setUploadStatus('Please select a Python (.py) file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUploadStatus(response.data);
        } catch (error) {
            setUploadStatus('Upload failed. Please check the file and try again.');
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Select a Python (.py) file:</label>
                    <input type="file" className="form-control" id="file" accept=".py" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">Upload Scraper</button>
                {uploadStatus && <div className="mt-3">{uploadStatus}</div>}
            </form>
        </div>
    );
}

export default ScraperUploadComponent;
