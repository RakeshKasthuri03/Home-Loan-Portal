import { Link } from "react-router-dom";
import Eligibilty from "../../Components/calculator/Eligibility";
import "../../Styles/EMI.css"
function EligibilityPage(){
    return(
        <>
        <div>
            <Eligibilty/>
            <div className="info">
  <p>
    These calculators are provided only as general self-help Planning Tools.
    Results depend on many factors, including the assumptions you provide.
    We do not guarantee their accuracy or applicability to your circumstances.
    <strong> NRIs should input net income.</strong>
  </p>

  <h2>Home Loan Eligibility Calculator</h2>
  <p>
    MLRR Bank's home loan eligibility calculator helps you determine how much loan
    amount you can avail based on your income and financial obligations. It allows
    you to plan your home purchase efficiently by giving an estimate of your borrowing
    capacity. With competitive interest rates and flexible tenure options, MLRR Bank
    ensures maximum affordability for your dream home.
  </p>

  <h2>What is Home Loan Eligibility Calculator?</h2>
  <p>
    A Home Loan Eligibility Calculator is a tool that helps you estimate the loan
    amount you are eligible for based on factors like your income, existing EMIs,
    loan tenure, and interest rate. It helps in better financial planning and
    ensures that you apply for a loan amount within your repayment capacity.
  </p>

  <h2>What Determines Your Loan Eligibility?</h2>
  <p>
    Your loan eligibility depends on multiple factors such as your monthly income,
    existing liabilities (EMIs), age, loan tenure, and interest rate. Higher income
    and lower existing EMIs increase your chances of getting a higher loan amount.
  </p>

  <h2>How is Loan Eligibility Calculated?</h2>
  <p>
    Banks generally calculate eligibility based on your net monthly income after
    deducting existing EMIs. A fixed percentage of your income is considered for
    EMI repayment.
  </p>

  <p>
    <strong>Eligible EMI = (Monthly Income − Existing EMIs) × 40% to 50%</strong>
  </p>

  <p>
    Based on this EMI, the maximum loan amount is calculated using tenure and
    interest rate.
  </p>

  <div className="emi-example">
    <p>
      For example, if a person has a monthly income of ₹1,00,000 and existing EMIs
      of ₹20,000, then the net income is ₹80,000. Assuming 50% eligibility:
    </p>

    <p>
      <strong>Eligible EMI = ₹80,000 × 50% = ₹40,000</strong>
    </p>

    <p>
      Based on tenure and interest rate, the loan amount is calculated from this EMI.
    </p>
  </div>

  <p>
    If your existing EMIs are high compared to your income, your eligibility may
    reduce significantly or become zero.
  </p>

  <p>
    Use MLRR Eligibility Calculator to instantly check your borrowing capacity and
    plan your finances better.
  </p>
</div>
            <div className="btn-emi">
                <Link className="hdr-btn hdr-btn--primary text-decoration-none" to="/loan-types">Apply for the Loan</Link>
            </div>
        </div>
        </>
    );
}

export default EligibilityPage;