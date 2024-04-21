import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext'; // Import useUser to access the current user

const FileContext = createContext();

export const FileProvider = ({ children }) => {
    const { user } = useUser(); // Use user context to access current user information
    const [userFiles, setUserFiles] = useState({});

    useEffect(() => {
        // Initialize from local storage based on the current user
        const storedFiles = localStorage.getItem('userFiles');
        const files = storedFiles ? JSON.parse(storedFiles) : {};
        setUserFiles(files[user?.username] || {}); // Load only the files for the logged-in user
    }, [user]);

    useEffect(() => {
        // Save to local storage whenever userFiles changes
        const allFiles = JSON.parse(localStorage.getItem('userFiles') || '{}');
        allFiles[user?.username] = userFiles; // Save under the user's username
        localStorage.setItem('userFiles', JSON.stringify(allFiles));
    }, [userFiles, user]);

    return (
        <FileContext.Provider value={{ userFiles, setUserFiles }}>
            {children}
        </FileContext.Provider>
    );
};

export const useFiles = () => useContext(FileContext);
