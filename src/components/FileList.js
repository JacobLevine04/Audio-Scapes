import React from 'react';
import './FileList.css';

function FileList({ files }) {
    // Formats the date and time from timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            month: 'numeric', day: 'numeric', 
            hour: 'numeric', minute: 'numeric', hour12: true 
        });
    };

    // Function to return filename with user and date information
    const formatDisplayName = (file) => {
        if (!file || typeof file.fileName !== 'string') {
            console.error('Invalid file:', file);
            return 'Invalid File';
        }
        const formattedDate = formatDate(file.uploadedAt);
        const cleanFileName = file.fileName.replace(/^[^_]*_/, '');
        return `(${formattedDate}) ${file.username} - ${cleanFileName}`;
    };

    const preventCache = (fileName) => {
        return `${fileName}?${new Date().getTime()}`;
    };

    return (
        <div className="file-list">
            {files.map((file, index) => ( // Use index as key to ensure uniqueness
                <div key={index} className="file-entry">
                    <p className="file-name">{formatDisplayName(file)}</p>
                    <audio controls>
                        <source src={`http://localhost:3001/uploads/${preventCache(file.fileName)}`} type="audio/mp3" />
                        Your browser does not support the audio element.
                    </audio>
                </div>
            ))}
        </div>
    );
}

export default FileList;
