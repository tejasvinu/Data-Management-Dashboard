import { useState, useEffect } from 'react';
import axios from 'axios';

function GeneratedFilesList() {
  const [databaseType, setDatabaseType] = useState('mysql');
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGeneratedFiles();
  }, [databaseType]);

  const fetchGeneratedFiles = async () => {
    try {
      let endpoint = '';
      if (databaseType === 'mysql') {
        endpoint = 'http://localhost:8080/mysql/List';
      } else if (databaseType === 'mongo') {
        endpoint = 'http://localhost:8080/mongo/List';
      }

      const response = await axios.get(endpoint);
      console.log(response.data);
      setGeneratedFiles(response.data);
    } catch (error) {
      setError('Error fetching generated files.');
      console.error('Error fetching generated files:', error);
    }
  };

  const handleDownload = async (filename) => {
    try {
      let endpoint = '';
      endpoint = `http://localhost:8080/download/${filename}`;
      const response = await axios.get(endpoint, {
        responseType: 'blob'
      });

      if (response.status === 200) {
        const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error('Error occurred while downloading file.');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>List of Generated Files</h2>
      <div className="mb-3">
        <label htmlFor="databaseType" className="form-label">Select Database Type</label>
        <select className="form-select" id="databaseType" value={databaseType} onChange={(e) => setDatabaseType(e.target.value)}>
          <option value="mysql">MySQL</option>
          <option value="mongo">MongoDB</option>
        </select>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <ul className="list-group">
        {generatedFiles.map((file, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{file.fileName}</span>
            <button className="btn btn-primary" onClick={() => handleDownload(file.fileName)}>Download</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GeneratedFilesList;
