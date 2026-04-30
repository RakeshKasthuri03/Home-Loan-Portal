import { useState } from "react";
import "../../Styles/EMI.css";

function EMI() {
  const [loan, setLoan] = useState(2500000);
  const [tenure, setTenure] = useState(30);
  const [rate, setRate] = useState(8.5);

  const monthlyRate = rate / 12 / 100;
  const months = tenure * 12;

  const emi =
    (loan * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  const totalAmount = emi * months;
  const interest = totalAmount - loan;

  return (
    <div className="container">
      

      <div className="content">
        
        {/* LEFT SIDE */}
        <div className="left">

          <div className="input-group">
            <div className="label-row">
              <label>Loan Amount</label>
              <span className="value">₹ {loan.toLocaleString()}</span>
            </div>
            <input type="range" min="100000" max="10000000"
              value={loan}
              onChange={(e) => setLoan(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Tenure (Years)</label>
              <span className="value">{tenure}</span>
            </div>
            <input type="range" min="1" max="30"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label>Interest Rate (% P.A.)</label>
              <span className="value">{rate}</span>
            </div>
            <input type="range" min="1" max="15" step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="right">
          <h3>Monthly Home Loan EMI</h3>
          <h2 className="emi">₹ {emi.toFixed(0)}</h2>

          <div className="details">
            <p>Principal Amount</p>
            <h4>₹ {loan.toLocaleString()}</h4>

            <p>Interest Amount</p>
            <h4>₹ {interest.toFixed(0)}</h4>

            <p>Total Amount Payable</p>
            <h4>₹ {totalAmount.toFixed(0)}</h4>
          </div>

          <button className="hdr-btn hdr-btn--primary w-100 btn-cal">Talk To Our Loan Expert</button>
        </div>

      </div>
    </div>
  );
}

export default EMI;
