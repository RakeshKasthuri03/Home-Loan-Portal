import { useState } from "react";

export default function Documents({ user }) {
  const [uploadedFiles, setUploadedFiles] = useState({});

  const documentTypes = [
    { name: "PAN Card", description: "Permanent Account Number" },
    { name: "Aadhar Card", description: "National identity card" },
    { name: "LOC", description: "Letter of Credit" },
    { name: "Salary Slip", description: "Latest salary statement" },
    { name: "NOC", description: "No Objection Certificate" },
    { name: "Agreement", description: "Loan agreement" },
  ];

  const handleFileChange = (docName, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles(prev => ({
        ...prev,
        [docName]: file.name
      }));
    }
  };

  return (
    <div className="dashboard-main">
      <h2>{user?.name ?? "User"} – Documents</h2>
      <p>Upload your required documents for loan processing.</p>

      <table className="documents-table">
        <thead>
          <tr>
            <th>Document</th>
            <th>Upload</th>
          </tr>
        </thead>
        <tbody>
          {documentTypes.map((doc, index) => (
            <tr key={index}>
              <td>
                <strong>{doc.name}</strong>
                <br />
                <small>{doc.description}</small>
              </td>
              <td>
                {uploadedFiles[doc.name] ? (
                  <div className="upload-status uploaded">
                    <span className="status-icon">✓</span>
                    {doc.name} uploaded
                    <button className="edit-btn" title="edit" onClick={() => document.querySelector(`input[data-doc="${doc.name}"]`).click()}>
                      ✏️
                    </button>
                  </div>
                ) : (
                  <div className="upload-status">
                    <label className="upload-label">
                      <span className="upload-icon">📁</span>
                      Upload valid document
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        data-doc={doc.name}
                        onChange={(e) => handleFileChange(doc.name, e)}
                        style={{ display: 'none' }}
                      />
                    </label>
                    <button className="edit-btn" title="edit" onClick={() => document.querySelector(`input[data-doc="${doc.name}"]`).click()}>
                      ✏️
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}




