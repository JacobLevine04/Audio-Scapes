import React, { useState, useEffect } from 'react';
import { useUser } from '../UserContext'; // Adjust the path as needed
import './FileList.css';

function FileList() {
    const [files, setFiles] = useState([]);
    const { user } = useUser(); // This should give you the current user context

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3001/files?username=${user.username}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFiles(data); // Set the files in state, which updates your component
            } catch (error) {
                console.error("Could not fetch files: ", error);
            }
        };

        if (user) {
            fetchFiles();
        }
    }, [user]); // Runs when the component mounts and when the user context updates

    return (
        <div className="file-list">
            {files.map((file, index) => (
                <div key={index} className="file-entry">
                    <span>{file.filename}</span>
                    {/* Add more file details here as needed */}
                </div>
            ))}
        </div>
    );
}

export default FileList;
