import { types } from '../../utils/loanTypes';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import '../../Styles/LoanTypes.css';

function LoanTypes() {
    return (
        <>
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
                        <Button variant="primary" className="w-100 fw-bold">
                            Apply for {loan.title} &rarr;
                        </Button>
                    </Card.Footer>
                </Card>
            ))}
        </div>
        <div className="loan-container">
            <div className="loan-card-info">
                <h1 className="loan-title-info">Addendum to Loan Agreement</h1>

                <p className="loan-intro">
                In view of the RBI circular dated <strong>12 Nov 2021</strong> on
                “Prudential norms on Income Recognition, Asset Classification and
                Provisioning”, some important terms and conditions of the loan are
                elaborated below to ensure borrower awareness regarding repayment.
                </p>

                <section className="table-wrapper">
                    <table className="repayment-table">
                        <thead>
                        <tr>
                            <th>Repayment of EMI</th>
                            <th>Due date of payment</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Due date of payment of 1st EMI</td>
                            <td>
                            <span className="required-star">*</span>
                            5th day of the month, following the month in which the full and
                            final the loan is disbursed.
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <p><span className="required-star">*</span>Borrower is required to pay subsequent EMIs at the end of each respective month  and shall in any case
                    pay on or before the 5th of the following month.</p>
                    <table className="repayment-table">
                        <thead>
                        <tr>
                            <th>Payment of EMI</th>
                            <th>Due date of payment</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Due date of 1st PEMI</td>
                            <td>
                            <span className="required-star">*</span>
                            5th day of the month
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <p><span className="required-star">*</span>Borrower is required to pay subsequent PEMIs at the end of each respective month  and shall in any case
                    pay on or before the 5th of the following month.</p>
                   
                </section>
                <section className="classification-wrapper">
                    <div className="classification-header">
                        Classification of Account
                    </div>

                    <div className="classification-body">
                        <ol className="classification-list">
                        <li>
                            Borrower shall pay the EMI / PEMI on or prior to the Due date as
                            mentioned above.
                        </li>

                        <li>
                            Non payment or delay in payment of EMI or PEMI by the Due date,
                            shall render the Borrower liable to pay delayed payment charges as
                            mentioned in the MITC. The delayed payment charges till the
                            realisation of such outstanding amount may be revised and announced
                            by MLRR from time to time. In such event/s, the Borrower shall also
                            be liable to pay incidental charges and costs/damages to MLRR, as
                            may be stipulated by MLRR in that behalf and as agreed upon in the
                            Loan Agreement.
                        </li>

                        <li>
                            If the PEMI / EMI are not being paid by the borrower on the due dates,
                            the borrower's loan account shall be downgraded as under:
                        </li>
                        
                     <table className="repayment-table">
                        <thead>
                            <tr>
                            <th>Category</th>
                            <th>Basis of Classification</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>
                                More than 30 Days from the due date of payment and upto 60 days
                            </td>
                            <td>
                                <span className="required-star">*</span> SMA 1
                            </td>
                            </tr>

                            <tr>
                            <td>
                                More than 60 days from the due date and upto 90 days of the payments
                            </td>
                            <td>
                                <span className="required-star">*</span> SMA 2
                            </td>
                            </tr>

                            <tr>
                            <td>NPA (Non Performing Account)</td>
                            <td>More than 90 Days</td>
                            </tr>

                            <tr>
                            <td colSpan="2">
                                <span className="required-star">*</span> SMA accounts are special mentioned
                                accounts as per RBI guidelines signifying stress in the Borrowers
                                repayment behaviour and are required to be reported to RBI.
                            </td>
                            </tr>
                        </tbody>
                    </table>
                     <li>
                            All total overdues should be paid by the borrower on or before the due date of the payment.  Failing which
the account would be downgraded in accordance with the RBI guidelines as explained above.
                    </li>
                     <li>
                            .Once the loan is classified as an NPA, it shall remain so until and unless  the entire full overdue amount
has been paid.  The reporting to Credit Bureaus and Regulatory Authorities  would be in accordance
                        </li>
                         <li>
                            The Account can be upgraded to a  standard classification  on payment of entire overdues  in full i.e there
should be  zero outstanding in the  account.
                        </li>
                        <li>
                            The term " repayment" means the repayment of the principal amount of the loan , interest thereon ,
commitment and/ or any other charges, premium, fees or other dues payable in terms of  this agreement to
MLRR
                        </li>
                        </ol>
                    </div>
                </section>
            </div>
        </div>
     </>
    );
}

export default LoanTypes;