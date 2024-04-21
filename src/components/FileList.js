import './FileList.css';

function FileList({ files }) {
    const formatFileName = (fileName) => {
      let parts = fileName.split('_');
      parts.shift();
      return parts.join('_');
    };
  
    const preventCache = (fileName) => {
      return `${fileName}?${new Date().getTime()}`;
    }
  
    return (
      <div className="file-list">
        {files.map((file) => (
          <div key={file} className="file-entry"> {/* Use the full filename as the key */}
            <p className="file-name">{formatFileName(file)}</p>
            <audio controls>
              <source src={`http://localhost:3001/uploads/${preventCache(file)}`} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
        ))}
      </div>
    );
  }
  
export default FileList;
