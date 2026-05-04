import { useState, useEffect } from "react";
import "../../Styles/EMI.css";

function Eligibility() {
  const [gross, setGross] = useState(360000);
  const [tenure, setTenure] = useState(30);
  const [rate, setRate] = useState(7.5);
  const [otherEmi, setOtherEmi] = useState(0);

  const [loanEligibility, setLoanEligibility] = useState(0);
  const [emi, setEmi] = useState(0);

  useEffect(() => {
    if (otherEmi > gross) {
      // ✅ Reset values
      setLoanEligibility(0);
      setEmi(0);

      alert(
        "We are unable to show you any offers currently as your current EMIs amount is very high. You can go back and modify your inputs if you wish to recalculate your eligibility."
      );
      return;
    }

    // ✅ Simple eligibility logic
    const netIncome = gross - otherEmi;
    const eligibleLoan = netIncome * 60; // approx logic
    const monthlyEmi = netIncome * 0.4;

    setLoanEligibility(eligibleLoan);
    setEmi(monthlyEmi);
  }, [gross, otherEmi, tenure, rate]);

  return (
    <div className="container">
      <div className="content">

        {/* LEFT SIDE */}
        <div className="left">

          <div className="input-group">
            <div className="label-row">
              <label>Gross Income (Monthly)</label>
              <span className="value">₹ {gross.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="1000000"
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
              <span className="value">{rate}</span>
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
              <span className="value">₹ {otherEmi.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="500000"
              value={otherEmi}
              onChange={(e) => setOtherEmi(Number(e.target.value))}
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <h3>Your Home Loan Eligibility</h3>
          <h2 className="emi">₹ {loanEligibility.toFixed(0)}</h2>

          <div className="details">
            <p>Your Home Loan EMI will be</p>
            <h4>₹ {emi.toFixed(0)} /month</h4>
          </div>

        <button className="hdr-btn hdr-btn--primary w-100 btn-cal">Talk To Our Loan Expert</button>

        </div>

      </div>
    </div>
  );
}

export default Eligibility;