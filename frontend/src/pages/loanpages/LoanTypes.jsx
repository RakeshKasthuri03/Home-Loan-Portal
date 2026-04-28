import { useNavigate } from 'react-router-dom';
import { types } from '../../utils/loanTypes';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import './LoanTypes.css';

// Map loanTypes title → loanTypeConfig key
const TITLE_TO_KEY = {
  "Home Loan":            "PURCHASE",
  "Plot Loan":            "PLOT",
  "NRI Home Loan":        "NRI",
  "Home Renovation Loan": "RENOVATION",
  "Balance tranfer":      "BALANCE_TRANSFER",
};

function LoanTypes() {
  const navigate = useNavigate();

  const handleApply = (title) => {
    const key = TITLE_TO_KEY[title] || "PURCHASE";
    navigate(`/apply?type=${key}`);
  };

  return (
    <>
      <Header />
      <div className="loan-types-page">

        {/* Hero */}
        <div className="lt-hero">
          <div className="lt-hero-badge">{types.length} loan products available</div>
          <h1>Find the right loan for you</h1>
          <p>Compare our home loan products — from purchase to renovation — and apply in minutes.</p>
        </div>

        {/* Cards */}
        <div className="loan-types-grid">
          {types.map((loan, idx) => (
            <Card className="loan-type-cards" key={idx}>
              <Card.Body>
                <div className="loan-card-header">
                  <span className="loan-icon">{loan.icon}</span>
                  <span className="loan-badge">{loan.intrest}</span>
                </div>
                <Card.Title className="loan-title">{loan.title}</Card.Title>
                <Card.Text className="loan-desc">{loan.desc}</Card.Text>
                <div className="loan-details">
                  <div>
                    <div className="loan-detail-label">{loan.maxAmount}</div>
                    <div className="loan-detail-value">Max amount</div>
                  </div>
                  <div>
                    <div className="loan-detail-label">{loan.approval}</div>
                    <div className="loan-detail-value">Approval</div>
                  </div>
                  <div>
                    <div className="loan-detail-label">{loan.maxtenure}</div>
                    <div className="loan-detail-value">Max tenure</div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0">
                <Button
                  variant="primary"
                  className="w-100 fw-bold"
                  onClick={() => handleApply(loan.title)}
                >
                  Apply for {loan.title} →
                </Button>
              </Card.Footer>
            </Card>
          ))}
        </div>

        {/* Addendum section */}
        <div className="loan-container">
          <div className="loan-card-info">
            <h1 className="loan-title-info">Addendum to Loan Agreement</h1>
            <p className="loan-intro">
              In view of the RBI circular dated <strong>12 Nov 2021</strong> on
              "Prudential norms on Income Recognition, Asset Classification and
              Provisioning", some important terms and conditions of the loan are
              elaborated below to ensure borrower awareness regarding repayment.
            </p>
            <section className="table-wrapper">
              <table className="repayment-table">
                <thead>
                  <tr><th>Repayment of EMI</th><th>Due date of payment</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Due date of payment of 1st EMI</td>
                    <td><span className="required-star">*</span> 5th day of the month, following the month in which the full and final loan is disbursed.</td>
                  </tr>
                </tbody>
              </table>
              <p><span className="required-star">*</span> Borrower is required to pay subsequent EMIs at the end of each respective month and shall in any case pay on or before the 5th of the following month.</p>
            </section>

            <section className="classification-wrapper">
              <div className="classification-header">Classification of Account</div>
              <div className="classification-body">
                <ol className="classification-list">
                  <li>Borrower shall pay the EMI / PEMI on or prior to the Due date as mentioned above.</li>
                  <li>Non payment or delay in payment of EMI or PEMI by the Due date shall render the Borrower liable to pay delayed payment charges as mentioned in the MITC.</li>
                  <li>If the PEMI / EMI are not being paid by the borrower on the due dates, the borrower's loan account shall be downgraded as under:</li>
                </ol>
                <table className="repayment-table">
                  <thead>
                    <tr><th>Category</th><th>Basis of Classification</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>More than 30 Days from due date and upto 60 days</td><td><span className="required-star">*</span> SMA 1</td></tr>
                    <tr><td>More than 60 days from due date and upto 90 days</td><td><span className="required-star">*</span> SMA 2</td></tr>
                    <tr><td>NPA (Non Performing Account)</td><td>More than 90 Days</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>

      </div>
      <Footer />
    </>
  );
}

export default LoanTypes;
