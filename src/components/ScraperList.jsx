import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useHistory for programmatic navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '../css/dblist.css'
function LinksList() {
    const [links, setLinks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchLinks().then(r => console.log(r));
    }, []);

    const fetchLinks = async () => {
        try {
            const response = await axios.get("http://localhost:8080/scraper/list");
            setLinks(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching links:', error);
        }
    };

    const handleLinkClick = (fileName) => {
        console.log(fileName);
        // Redirect to a new route to view the database content
        axios.get(`http://localhost:8080/scraper/run/${fileName}`).then(r => console.log(r));
    };

    // Extracting unique keys from the links array
    const tableHeadings = links.length > 0 ? Object.keys(links[0]) : [];

    return (
        <div className="container mt-5">
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
                            <button className="btn btn-primary" onClick={() => handleLinkClick(link.fileName)}>RUN</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default LinksList;
