import React, { useState } from 'react';
import { UploadFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useUser } from '../../UserContext'; // Adjust the import path as needed

export default function Upload({ updateFileList }) {
  const [uploadStatus, setUploadStatus] = useState('');
  const { user } = useUser(); // Get the logged-in user's info from context

  const onDrop = async (acceptedFiles) => {
    if (!user) {
      setUploadStatus('You need to be logged in to upload files.');
      return; // Exit if there is no user information
    }

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);
    formData.append('userId', user._id); // Add the user's ID to the form data

    try {
      const response = await fetch('http://127.0.0.1:3001/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Ensures cookies or auth headers are sent with the request
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const uploadedFile = await response.json(); // Assuming the server returns the details of the uploaded file
      updateFileList(uploadedFile); // Update the file list with the newly uploaded file
      setUploadStatus('File uploaded successfully');

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
        {uploadStatus && <p style={{ color: 'white' }}>{uploadStatus}</p>}
      </div>
    </div>
  );
}
