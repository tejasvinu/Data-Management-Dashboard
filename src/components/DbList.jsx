import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory for programmatic navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../css/dblist.css'
function LinksList() {
  const [links, setLinks] = useState([]);
  const [databaseType, setDatabaseType] = useState('mysql');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState([]);
  const togglePasswordVisibility = (index) => {
    const newShowPassword = [...showPassword];
    newShowPassword[index] = !newShowPassword[index];
    setShowPassword(newShowPassword);
  };

  useEffect(() => {
    fetchLinks();
  }, [databaseType]);

  const fetchLinks = async () => {
    try {
      let endpoint = '';
      if (databaseType === 'mysql') {
        endpoint = 'http://localhost:8080/api/mysql-links';
      } else if (databaseType === 'mongo') {
        endpoint = 'http://localhost:8080/api/mongo-links';
      }

      const response = await axios.get(endpoint);
      setLinks(response.data);
      setShowPassword(new Array(response.data.length).fill(false));
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const handleDatabaseTypeChange = (event) => {
    setDatabaseType(event.target.value);
  };

  const handleLinkClick = (linkId) => {
    // Redirect to a new route to view the database content
    navigate(`/tableData/${linkId}?dbType=${databaseType}`);
  };

  // Extracting unique keys from the links array
  const tableHeadings = links.length > 0 ? Object.keys(links[0]) : [];

  return (
    <div className="container mt-5">
      <h2>List of {databaseType === 'mysql' ? 'MySQL' : 'MongoDB'} Links</h2>
      <div className="mb-3">
        <label htmlFor="databaseType" className="form-label">Choose Database Type: </label>
        <select id="databaseType" className="form-select" value={databaseType} onChange={handleDatabaseTypeChange}>
          <option value="mysql">MySQL</option>
          <option value="mongo">MongoDB</option>
        </select>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            {tableHeadings.map((heading, index) => (
              <th key={index} scope="col">{heading}</th>
            ))}
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
        {links.map((link, rowIndex) => (
            <tr key={rowIndex}>
              {tableHeadings.map((heading, colIndex) => (
                  <td key={colIndex}>
                    {heading === 'password' ? (
                        <>
                          {showPassword[rowIndex] ? link[heading] : '••••••'}
                          <FontAwesomeIcon className="icon" onClick={() => togglePasswordVisibility(rowIndex)} icon={showPassword[rowIndex] ? faEyeSlash : faEye} />
                        </>
                    ) : (
                        link[heading]
                    )}
                  </td>
              ))}
              <td>
                <button className="btn btn-primary" onClick={() => handleLinkClick(link.id)}>View</button>
              </td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}

export default LinksList;
