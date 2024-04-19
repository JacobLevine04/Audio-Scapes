import React, { useState } from 'react';
import { UploadFile } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

export default function Upload() {
  const [uploadStatus, setUploadStatus] = useState('');

  const onDrop = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    try {
      const response = await fetch('http://127.0.0.1:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Server responded with an error!');
      }
      
      setUploadStatus('File uploaded successfully');
      console.log('File uploaded successfully');

    } catch (error) {
      setUploadStatus('Error uploading file');
      console.error('Error uploading file:', error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.m4a, .mp3, .mov, .mp4, .wav',
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
