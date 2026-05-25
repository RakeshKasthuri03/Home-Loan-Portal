import { useState } from 'react';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import './Upload.css';

export default function Upload({ uploadUrl = '/api/upload', fieldName = 'file', accept = '*/*', multiple = false, purpose = '', userId, onUploaded, compact = false }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleChange = async (e) => {
    const files = multiple ? Array.from(e.target.files) : [e.target.files[0]];
    if (!files || files.length === 0) return;

    try {
      setUploading(true);
      const fd = new FormData();
      // for single file send one; for multiple, send first (can be enhanced)
      fd.append(fieldName, files[0]);
      if (userId) fd.append('userId', userId);
      if (purpose) fd.append('purpose', purpose);
      // optional metadata
      if (files[0] && files[0].name) fd.append('docName', files[0].name);

      const base = import.meta?.env?.VITE_API_BASE || 'http://localhost:5000';
      const url = uploadUrl.startsWith('http') ? uploadUrl : `${base}${uploadUrl}`;

      const res = await axios.post(url, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const fileUrl = res.data?.url || res.data?.file?.url || res.data?.doc?.url || (res.data?.user && res.data.user.profilePhoto) || null;
      if (fileUrl) setPreview(fileUrl);
      // Ensure callers receive the resolved URL even if backend response shape varies
      const payload = { ...(res.data || {}), url: fileUrl };
      if (onUploaded) onUploaded(payload);
    } catch (err) {
      console.error('Upload failed', err);
      if (onUploaded) onUploaded({ error: true, details: err });
    } finally {
      setUploading(false);
    }
  };

  if (compact) {
    return (
      <span className="upload-component upload-compact">
        <label className="upload-label" aria-label="Upload file">
          <input type="file" accept={accept} multiple={multiple} onChange={handleChange} />
          <span className="upload-button small">
            {uploading ? 'Uploading…' : <FiUpload className="upload-icon" aria-hidden="true" />}
          </span>
        </label>
      </span>
    );
  }

  return (
    <div className="upload-component">
      <label className="upload-label">
        <input type="file" accept={accept} multiple={multiple} onChange={handleChange} />
        <span className="upload-button">{uploading ? 'Uploading…' : 'Upload'}</span>
      </label>
      {preview && (
        <div className="upload-preview">
          {preview.match(/\.(jpeg|jpg|gif|png)$/i) ? (
            <img src={preview} alt="preview" />
          ) : (
            <a href={preview} target="_blank" rel="noreferrer">View file</a>
          )}
        </div>
      )}
    </div>
  );
}
