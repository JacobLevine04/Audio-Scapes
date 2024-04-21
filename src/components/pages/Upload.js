import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadFile } from '@mui/icons-material';
import FileList from '../FileList'; // Import the FileList component


export default function Upload({ updateFileList }) {
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to store uploaded files

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];

    try {
      // Perform any necessary validation on the file here

      // Save the file to the 'uploads' folder
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
      updateFileList(uploadedFile);
      setUploadStatus('File uploaded successfully');
      setUploadedFiles(prevFiles => [...prevFiles, uploadedFile]); // Update uploadedFiles state
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
        {/* Display uploaded files below the upload button */}
        <FileList files={uploadedFiles} />
      </div>
    </div>
  );
}
