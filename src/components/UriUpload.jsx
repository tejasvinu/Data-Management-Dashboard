import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function UriUpload() {
  const [databaseType, setDatabaseType] = useState('mysql');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dbName, setDbName] = useState('');
  const [tableName, setTableName] = useState('');
  const [collectionName, setCollectionName] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleDatabaseTypeChange = (event) => {
    setDatabaseType(event.target.value);
    clearFields();
  };

  const clearFields = () => {
    setUrl('');
    setUsername('');
    setPassword('');
    setDbName('');
    setTableName('');
    setCollectionName('');
    setResponseMessage('');
    setDownloadUrl('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      let endpoint = '';
      let requestBody = {};
  
      if (databaseType === 'mysql') {
        endpoint = 'http://localhost:8080/mysql/extract';
        requestBody = {
          mysqlUrl: url,
          username,
          password,
          dbName,
          tableName
        };
      } else if (databaseType === 'mongo') {
        endpoint = 'http://localhost:8080/mongo/extract';
        requestBody = {
          mongoUri: url,
          dbName,
          collectionName
        };
      }
  
      const response = await axios.post(endpoint, requestBody);
  
      if (response.status === 200) {
        const data = response.data;
        console.log('Initiating download...');
        console.log(data.fileName);
        downloadFile(data.fileName); // Pass the correct property name
        setResponseMessage('Data extraction and download initiated.');
      } else {
        throw new Error('Error occurred while fetching data.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Error occurred while fetching data.');
    }
  };
  
  const downloadFile = async (filename) => {
    try {
      console.log('Downloading file...');
      console.log(filename);
      const response = await axios.get(`http://localhost:8080/download/${filename}`, {
        responseType: 'blob' // Ensure response type is set to 'blob' for binary data
      });
  
      if (response.status === 200) {
        // Create a URL object from the blob response
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadUrl(downloadUrl);
      } else {
        throw new Error('Error occurred while downloading file.');
      }
    } catch (error) {
      console.error('Error:', error);
      setResponseMessage('Error occurred while downloading file.');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Extract Data from Database</h1>
      <div className="mb-3">
        <label htmlFor="databaseType" className="form-label">Select Database Type</label>
        <select className="form-select" id="databaseType" value={databaseType} onChange={handleDatabaseTypeChange}>
          <option value="mysql">MySQL</option>
          <option value="mongo">MongoDB</option>
        </select>
      </div>
      <form onSubmit={handleSubmit}>
      <div className="mb-3">
          <label htmlFor="url" className="form-label">{databaseType === 'mysql' ? 'MySQL URL' : 'MongoDB URL'}</label>
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
          </>
        )}
        <div className="mb-3">
          <label htmlFor="dbName" className="form-label">Database Name</label>
          <input type="text" className="form-control" id="dbName" value={dbName} onChange={(e) => setDbName(e.target.value)} required />
        </div>
        {databaseType === 'mysql' ? (
          <div className="mb-3">
            <label htmlFor="tableName" className="form-label">Table Name</label>
            <input type="text" className="form-control" id="tableName" value={tableName} onChange={(e) => setTableName(e.target.value)} required />
          </div>
        ) : (
          <div className="mb-3">
            <label htmlFor="collectionName" className="form-label">Collection Name</label>
            <input type="text" className="form-control" id="collectionName" value={collectionName} onChange={(e) => setCollectionName(e.target.value)} required />
          </div>
        )}
        <button type="submit" className="btn btn-primary">Extract Data</button>
      </form>
      {responseMessage && <div className="mt-3">{responseMessage}</div>}
      {downloadUrl && (
        <div className="mt-3">
          <a href={downloadUrl} className='btn btn-success'download>Download File</a>
        </div>
      )}
    </div>
  );
}

export default UriUpload;
