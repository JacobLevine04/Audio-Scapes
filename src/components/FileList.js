import React, { useState, useEffect } from 'react';
import './FileList.css';

function FileList() {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                // Fetch the list of files directly from the server's uploads folder
                const response = await fetch('http://localhost:3001/files');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFiles(data); // Set the files in state, which updates your component
            } catch (error) {
                console.error("Could not fetch files: ", error);
            }
        };

        fetchFiles(); // Fetch files when the component mounts
    }, []);

    return (
        <div className="file-list">
            {files.map((file, index) => (
                <div key={index} className="file-entry">
                    <span>{file}</span>
                    {/* Add more file details here as needed */}
                </div>
            ))}
        </div>
    );
}

export default FileList;
