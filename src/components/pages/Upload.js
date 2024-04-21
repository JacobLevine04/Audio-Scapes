import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import FileList from '../FileList';
import { useFiles } from '../../FileContext';
import { useUser } from '../../UserContext';
import axios from 'axios';  // Make sure axios is imported

export default function Upload() {
  const { user } = useUser();
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState(() => {
    const savedFiles = localStorage.getItem(`uploadedFiles-${user?.username}`);
    return savedFiles ? JSON.parse(savedFiles) : [];
  });
  const { userFiles, setUserFiles } = useFiles();

  useEffect(() => {
    if (user?.username) {
      localStorage.setItem(`uploadedFiles-${user.username}`, JSON.stringify(uploadedFiles));
    }
  }, [uploadedFiles, user?.username]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (!user || !user.username) {
      setUploadStatus('Error: No user logged in');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const uploadedFile = await response.json(); // Assuming response returns the filename
      setUploadStatus('File uploaded successfully');
      const currentTime = new Date().getTime();

      // Create a file object with additional metadata
      const fileData = {
        fileName: uploadedFile.fileName, // Assuming the response contains the filename
        username: user.username,
        uploadedAt: currentTime
      };

      const newUploadedFiles = [fileData, ...uploadedFiles]; // Store fileData objects instead of just names
      setUploadedFiles(newUploadedFiles);

      // Update user files
      const newUserFiles = {
        ...userFiles,
        [user.username]: [...(userFiles[user.username] || []), fileData.fileName]
      };

      // Also update friends' files
      const friendsRes = await axios.get(`http://localhost:3001/friends`, { params: { username: user.username } });
      const friends = friendsRes.data.currentFriends;

      friends.forEach(friend => {
        newUserFiles[friend] = [...(newUserFiles[friend] || []), fileData.fileName];
      });

      setUserFiles(newUserFiles);
      localStorage.setItem('userFiles', JSON.stringify(newUserFiles));  // Consider storing the full fileData if needed

    } catch (error) {
      setUploadStatus(`Error uploading file: ${error.message}`);
      console.error('Error uploading file:', error);
    }
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: 'audio/*,video/*',
  });

  return (
    <div className="upload">
      <video src="/videos/background.mp4" autoPlay loop muted className="dimmed-video" />
      <div className="hero-container">
        <h1 style={{ color: 'white' }}>UPLOAD AUDIO</h1>
        <div {...getRootProps()} className="hero-btns">
          <input {...getInputProps()} />
          <UploadFile className="custom-upload-btn" color="black" fontSize="extra large" />
        </div>
        {uploadStatus && <p style={{ color: 'white', marginTop: '110px' }}>{uploadStatus}</p>}
        <FileList files={uploadedFiles} />
      </div>
    </div>
  );
}
