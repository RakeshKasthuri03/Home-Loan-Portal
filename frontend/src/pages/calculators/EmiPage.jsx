import { Link } from "react-router-dom";
import EMI from "../../Components/calculator/EMI";
import "../../Styles/EMI.css"
function EmiPage(){
    return(
        <>
        <div>
            <EMI/>
            <div className="info">
                <p>These calculators are provided only as general self-help Planning Tools. 
                    Results depend on many factors, including the assumptions you provide. 
                    We do not guarantee their accuracy, or applicability to your circumstances.
                <strong>NRIs should input net income.</strong></p>
                <h2>Home Loan EMI Calculator</h2>
                <p>MLRR Bank's home loan calculator helps you calculate your Home Loan Emi with ease.
                     MLRR Bank's EMI calculator for a home loan can help you make an informed 
                     decision about buying a new house. The EMI calculator is useful in planning 
                     your cashflows for servicing your home loan. MLRR Bank offers home loans with 
                     EMIs starting from ₹716 per lac and interest rates starting from 8.5%* p.a. 
                     with additional features such as flexible repayment options and top-up loan. 
                     With a low-interest rate and long repayment tenure, MLRR Bank ensures a 
                     comfortable home loan EMI for you. With our reasonable EMIs, MLRR Home Loan 
                     is lighter on your pocket. Calculate the EMI that you will be required to pay 
                     for your home loan with our easy to understand home loan EMI calculator.</p>
                <h2>What is Home Loan EMI Calculator?</h2>
                <p>Home Loan EMI Calculator assists in calculation of the loan installment i.e. 
                    EMI towards your home loan. It an easy to use calculator and acts as a 
                    financial planning tool for a home buyer.</p>
                <h2>What is Home Loan EMI?</h2>
                <p>EMI stands for Equated Monthly Installment. It includes repayment of the 
                    principal amount and payment of the interest on the outstanding amount of 
                    your home loan. A longer loan tenure (for a maximum period of 30 years) 
                    helps in reducing the EMI.</p>
                <h2>Illustration: How is EMI on Loan Calculated?</h2>
                <h6>Formula for EMI Calculation is -</h6>
                <p><strong>P x R x (1+R)^N / [(1+R)^N-1] where-</strong></p>
                <p><strong>P</strong> = Principal loan amount</p>
                <p><strong>N</strong> = Loan tenure ipn months</p>
                <p><strong>R</strong> = Monthly interest rate</p>
                <p>The rate of interest <strong>(R)</strong>on your loan is calculated per month.</p>
                <p><strong>R</strong> = Annual Rate of interest/12/100</p>
                <p>If rate of interest is 7.2% p.a. then r = 7.2/12/100 = 0.006</p>
                <div className="emi-example">
                    <p>
                        For example, if a person avails a loan of ₹10,00,000 at an annual
                        interest rate of 7.2% for a tenure of 120 months (10 years), then
                        his EMI will be calculated as under:
                    </p>

                    <p>
                        <strong>EMI = ₹10,00,000 × 0.006 × (1 + 0.006)<sup>120</sup> /
                        ((1 + 0.006)<sup>120</sup> − 1) = ₹11,714</strong>
                    </p>
                </div>
                <p>The total amount payable will be ₹11,714 * 120 = ₹14,05,703. Principal 
                    loan amount is ₹10,00,000 and the Interest amount will be ₹4,05,703</p>
                <p>Calculating the EMI manually using the formula can be tedious.</p>
                <p>MLRR EMI Calculator can help you calculate your loan EMI with ease.</p>
            </div>
            <div className="btn-emi">
                <Link className="hdr-btn hdr-btn--primary text-decoration-none" to="/loan-types">Apply for the Loan</Link>
            </div>
        </div>
        </>
    );
}

export default EmiPage;