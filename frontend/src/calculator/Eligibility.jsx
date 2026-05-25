import { useState, useEffect } from "react";
import "../Styles/EMI.css";

function Eligibility() {
  // ✅ Correct: Monthly income (not yearly)
  const [gross, setGross] = useState(30000);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(7.5);
  const [otherEmi, setOtherEmi] = useState(0);

  const [loanEligibility, setLoanEligibility] = useState(0);
  const [emi, setEmi] = useState(0);

  // ✅ Currency formatter
  const formatINR = (num) =>
    new Intl.NumberFormat("en-IN").format(Math.round(num));

  useEffect(() => {
    // ✅ Basic validation
    if (gross <= 0 || otherEmi >= gross) {
      setLoanEligibility(0);
      setEmi(0);
      return;
    }

    // ✅ Dynamic FOIR (real banking logic)
    let FOIR = 0.5;
    if (gross < 30000) FOIR = 0.4;
    else if (gross < 75000) FOIR = 0.5;
    else FOIR = 0.6;

    // ✅ Step 1: Eligible EMI
    const eligibleEmi = gross * FOIR - otherEmi;

    if (eligibleEmi <= 0) {
      setLoanEligibility(0);
      setEmi(0);
      return;
    }

    // ✅ Step 2: Convert inputs
    const monthlyRate = rate / (12 * 100);
    const months = tenure * 12;

    let loanEligible = 0;

    // ✅ Step 3: Loan calculation
    if (monthlyRate === 0) {
      loanEligible = eligibleEmi * months;
    } else {
      const factor = Math.pow(1 + monthlyRate, months);

      loanEligible =
        (eligibleEmi * (factor - 1)) /
        (monthlyRate * factor);
    }

    // ✅ Final values
    setLoanEligibility(loanEligible);
    setEmi(eligibleEmi);

  }, [gross, otherEmi, tenure, rate]);

  return (
    <div className="container">
      <div className="content">

        {/* LEFT SIDE */}
        <div className="left">

          <div className="input-group">
            <div className="label-row">
              <label>Gross Income (Monthly)</label>
              <span className="value">₹ {formatINR(gross)}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="300000"
              value={gross}
              onChange={(e) => setGross(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Tenure (Years)</label>
              <span className="value">{tenure}</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Interest Rate (% P.A.)</label>
              <span className="value">{rate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="15"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Other EMIs (Monthly)</label>
              <span className="value">₹ {formatINR(otherEmi)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              value={otherEmi}
              onChange={(e) => setOtherEmi(Number(e.target.value))}
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <h3>Your Home Loan Eligibility</h3>
          <h2 className="emi">₹ {formatINR(loanEligibility)}</h2>

          <div className="details">
            <p>Your Maximum EMI Capacity</p>
            <h4>₹ {formatINR(emi)} / month</h4>
          </div>

          <button className="hdr-btn hdr-btn--primary w-100 btn-cal">
            Talk To Our Loan Expert
          </button>
        </div>

      </div>
    </div>
  );
}

export default Eligibility;