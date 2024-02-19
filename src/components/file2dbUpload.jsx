import React, { useState } from 'react';
import axios from 'axios';

function FileUploadComponent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [prompt, setPrompt] = useState('');
    const [mongoUri, setMongoUri] = useState('');
    const [mongoDbName, setMongoDbName] = useState('');
    const [mongoCollectionName, setMongoCollectionName] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    };

    // Handle changes for MongoDB fields
    const handleMongoUriChange = (event) => {
        setMongoUri(event.target.value);
    };
    const handleMongoDbNameChange = (event) => {
        setMongoDbName(event.target.value);
    };
    const handleMongoCollectionNameChange = (event) => {
        setMongoCollectionName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('prompt', prompt);
        formData.append('MongoUri', mongoUri);
        formData.append('MongoDbName', mongoDbName);
        formData.append('MongoCollectionName', mongoCollectionName);

        try {
            const response = await axios.post('http://localhost:8080/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setUploadStatus(response.data); // Response.data should contain the server message
        } catch (error) {
            setUploadStatus('Upload failed. Please check your settings and try again.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Select a file:</label>
                    <input type="file" className="form-control" id="file" accept=".jpg, .jpeg, .png, .pdf" onChange={handleFileChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="prompt" className="form-label">Enter a prompt:</label>
                    <input type="text" className="form-control" id="prompt" value={prompt} onChange={handlePromptChange} />
                </div>
                {/* Inputs for MongoDB settings */}
                <div className="mb-3">
                    <label htmlFor="mongoUri" className="form-label">MongoDB URI:</label>
                    <input type="text" className="form-control" id="mongoUri" value={mongoUri} onChange={handleMongoUriChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="mongoDbName" className="form-label">MongoDB Database Name:</label>
                    <input type="text" className="form-control" id="mongoDbName" value={mongoDbName} onChange={handleMongoDbNameChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="mongoCollectionName" className="form-label">MongoDB Collection Name:</label>
                    <input type="text" className="form-control" id="mongoCollectionName" value={mongoCollectionName} onChange={handleMongoCollectionNameChange} />
                </div>

                <button type="submit" className="btn btn-primary">Upload</button>
                <div>{uploadStatus}</div>
            </form>
        </div>
    );
}

export default FileUploadComponent;
