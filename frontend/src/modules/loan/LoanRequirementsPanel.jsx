import React from 'react';
import { LOAN_TYPES } from '../../utils/loanTypeConfig';
import './LoanRequirementsPanel.css';

/**
 * Panel showing what info/documents each loan type requires
 * Displayed before user starts application
 */
export default function LoanRequirementsPanel({ loanTypeKey, onStart, onClose }) {
  const loanConfig = LOAN_TYPES[loanTypeKey];
  
  if (!loanConfig) {
    return <div>Loan type not found</div>;
  }

  const steps = loanConfig.steps;

  // Extract all required fields from steps
  const requiredFields = steps
    .flatMap(step => step.fields)
    .filter(field => field.required);

  // Categorize fields
  const basicInfo = requiredFields.filter(f => 
    ['fullName', 'dob', 'mobile', 'email', 'panCard', 'aadharLast4'].includes(f.name)
  );

  const employmentInfo = requiredFields.filter(f => 
    ['employmentType', 'companyName', 'designation', 'workExperience', 'monthlyIncome'].includes(f.name)
  );

  const financialInfo = requiredFields.filter(f => 
    ['loanAmount', 'loanTenure', 'bankName', 'cibilScore'].includes(f.name)
  );

  const documents = requiredFields.filter(f => f.type === 'file');

  const loanSpecificInfo = requiredFields.filter(f => 
    f.name.includes('property') || 
    f.name.includes('plot') || 
    f.name.includes('renovation') ||
    f.name.includes('currentBank') ||
    f.name.includes('currentLoan') ||
    f.name.includes('overseas')
  );

  // Calculate estimated time based on number of steps
  const estimatedTime = steps.length > 5 ? '20-30 min' : '15-20 min';

  return (
    <div className="lrp-overlay">
      <div className="lrp-modal">
        {/* Header */}
        <div className="lrp-header">
          <div>
            <h2 className="lrp-title">{loanConfig.label}</h2>
            <p className="lrp-subtitle">{loanConfig.description}</p>
          </div>
          <button className="lrp-close" onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="lrp-content">
          
          {/* Quick Stats */}
          <div className="lrp-stats">
            <div className="lrp-stat">
              <span className="lrp-stat-icon">⏱️</span>
              <div>
                <div className="lrp-stat-label">Estimated Time</div>
                <div className="lrp-stat-value">{estimatedTime}</div>
              </div>
            </div>
            <div className="lrp-stat">
              <span className="lrp-stat-icon">📋</span>
              <div>
                <div className="lrp-stat-label">Steps</div>
                <div className="lrp-stat-value">{steps.length}</div>
              </div>
            </div>
            <div className="lrp-stat">
              <span className="lrp-stat-icon">📄</span>
              <div>
                <div className="lrp-stat-label">Documents</div>
                <div className="lrp-stat-value">{documents.length}</div>
              </div>
            </div>
          </div>

          {/* Info Sections */}
          <div className="lrp-sections">
            
            {/* Basic Information */}
            {basicInfo.length > 0 && (
              <div className="lrp-section">
                <h3 className="lrp-section-title">👤 Personal Information Required</h3>
                <ul className="lrp-checklist">
                  {basicInfo.map(field => (
                    <li key={field.name} className="lrp-item">
                      <span className="lrp-checkmark">✓</span>
                      <span>{field.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Employment Information */}
            {employmentInfo.length > 0 && (
              <div className="lrp-section">
                <h3 className="lrp-section-title">💼 Employment Details Required</h3>
                <ul className="lrp-checklist">
                  {employmentInfo.map(field => (
                    <li key={field.name} className="lrp-item">
                      <span className="lrp-checkmark">✓</span>
                      <span>{field.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Financial Information */}
            {financialInfo.length > 0 && (
              <div className="lrp-section">
                <h3 className="lrp-section-title">💰 Financial Information Required</h3>
                <ul className="lrp-checklist">
                  {financialInfo.map(field => (
                    <li key={field.name} className="lrp-item">
                      <span className="lrp-checkmark">✓</span>
                      <span>{field.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Loan-Specific Information */}
            {loanSpecificInfo.length > 0 && (
              <div className="lrp-section">
                <h3 className="lrp-section-title">🏠 {loanConfig.label} Specific Details</h3>
                <ul className="lrp-checklist">
                  {loanSpecificInfo.map(field => (
                    <li key={field.name} className="lrp-item">
                      <span className="lrp-checkmark">✓</span>
                      <span>{field.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <div className="lrp-section">
                <h3 className="lrp-section-title">📎 Documents Required</h3>
                <ul className="lrp-checklist">
                  {documents.map(field => (
                    <li key={field.name} className="lrp-item">
                      <span className="lrp-checkmark">✓</span>
                      <span>{field.label}</span>
                      <span className="lrp-format">({field.accept})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Eligibility & Benefits */}
          <div className="lrp-bottom">
            <div className="lrp-row">
              <div className="lrp-box">
                <h4>🎯 Eligibility</h4>
                <ul>
                  {loanConfig.eligibility?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="lrp-box">
                <h4>💡 Key Benefits</h4>
                <ul>
                  <li>Interest Rate: {loanConfig.interestRate}</li>
                  <li>Max Amount: {loanConfig.maxAmount}</li>
                  <li>Max Tenure: {loanConfig.maxTenure}</li>
                  <li>Approval Time: {loanConfig.approvalTime}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="lrp-footer">
          <button className="lrp-btn lrp-btn-cancel" onClick={onClose}>Cancel</button>
          <button className="lrp-btn lrp-btn-start" onClick={onStart}>
            Start Application →
          </button>
        </div>
      </div>
    </div>
  );
}
