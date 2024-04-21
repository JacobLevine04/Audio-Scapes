import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import FileList from '../FileList';
import axios from 'axios';
import { useFiles } from '../../FileContext';
import { useUser } from '../../UserContext';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const { userFiles, setUserFiles } = useFiles();
  const { user } = useUser();
  const [uploadStatus, setUploadStatus] = useState('');

  const [uploadedFiles, setUploadedFiles] = useState(() => {
    const savedFiles = localStorage.getItem(`uploadedFiles-${user?.username}`);
    return savedFiles ? JSON.parse(savedFiles) : [];
  });

  // Combined state and localStorage update
  const updateUploadedFiles = (newFileData) => {
    setUploadedFiles(prevUploadedFiles => {
      const updatedFiles = [newFileData, ...prevUploadedFiles];
      localStorage.setItem(`uploadedFiles-${user?.username}`, JSON.stringify(updatedFiles));
      return updatedFiles;
    });
  };

  useEffect(() => {
    if (user?.username) {
      // Fetch the initial state when the user logs in or when the component mounts
      const savedFiles = localStorage.getItem(`uploadedFiles-${user.username}`);
      if (savedFiles) {
        setUploadedFiles(JSON.parse(savedFiles));
      }
    }
  }, [user?.username]);

  // Inside your component
  const navigate = useNavigate();

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


      const uploadedFile = await response.json();
      const currentTime = new Date().getTime();


      const fileData = {
        fileName: uploadedFile.fileName,
        username: user.username,
        uploadedAt: currentTime
      };

      updateUploadedFiles(fileData);

      // Update user files
      const newUserFiles = { ...userFiles };
      newUserFiles[user.username] = [...(userFiles[user.username] || []), fileData];

      // Also update friends' files
      const friendsRes = await axios.get(`http://localhost:3001/friends`, { params: { username: user.username } });
      const friends = friendsRes.data.currentFriends;

      friends.forEach(friend => {
        newUserFiles[friend] = [...(newUserFiles[friend] || []), fileData];
      });

      setUserFiles(newUserFiles);
      localStorage.setItem('userFiles', JSON.stringify(newUserFiles));


      navigate('/user');
      setTimeout(() => navigate('/upload'), 5);  // Navigate back to upload after a short delay

      //setUploadStatus('File uploaded successfully');

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
