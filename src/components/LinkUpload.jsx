import React, { useState } from 'react';
import axios from 'axios';

function LinkUpload() {
  const [databaseType, setDatabaseType] = useState('mysql');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dbName, setDbName] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [tableName, setTableName] = useState('');

  const handleDatabaseTypeChange = (event) => {
    setDatabaseType(event.target.value);
    clearFields();
  };

  const clearFields = () => {
    setUrl('');
    setUsername('');
    setPassword('');
    setDbName('');
    setCollectionName('');
    setResponseMessage('');
    setTableName('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      let endpoint = '';
      let requestBody = {};
  
      if (databaseType === 'mysql') {
        endpoint = 'http://localhost:8080/api/mysql-links';
        requestBody = {
          dbName: dbName,
          mysqlUrl: url,
          username,
          password,
          tableName
        };
      } else if (databaseType === 'mongo') {
        endpoint = 'http://localhost:8080/api/mongo-links';
        requestBody = {
          mongoUri: url,
          dbName,
          collectionName
        };
      }
  
      const response = await axios.post(endpoint, requestBody);
  
      if (response.status === 200) {
        setResponseMessage('Link Uploaded!!!');
      } else {
        throw new Error('Error occurred while Uploading Link.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Error occurred while Uploading Link.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Upload Link</h1>
      <div className="mb-3">
        <label htmlFor="databaseType" className="form-label">Select Database Type</label>
        <select className="form-select" id="databaseType" value={databaseType} onChange={handleDatabaseTypeChange}>
          <option value="mysql">MySQL</option>
          <option value="mongo">MongoDB</option>
        </select>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="url" className="form-label">{databaseType === 'mysql' ? 'MySQL Host' : 'MongoDB URL'}</label>
          <input type="text" className="form-control" id="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
        </div>
        {databaseType === 'mysql' && (
          <>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="mb-3">
            <label htmlFor="tableName" className="form-label">Table Name</label>
            <input type="text" className="form-control" id="tableName" value={tableName} onChange={(e) => setTableName(e.target.value)} required />
          </div>
          </>
        )}
        <div className="mb-3">
          <label htmlFor="dbName" className="form-label">Database Name</label>
          <input type="text" className="form-control" id="dbName" value={dbName} onChange={(e) => setDbName(e.target.value)} required />
        </div>
        {databaseType === 'mongo' && (
          <div className="mb-3">
            <label htmlFor="collectionName" className="form-label">Collection Name</label>
            <input type="text" className="form-control" id="collectionName" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} required />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Upload DB</button>
      </form>
      {responseMessage && <div className="mt-3">{responseMessage}</div>}
    </div>
  );
}

export default LinkUpload;
