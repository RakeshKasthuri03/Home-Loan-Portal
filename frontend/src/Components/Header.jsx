import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from "react-bootstrap/Image";
import logo from '../assets/logo.png';
import { NavLink } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
function Header() {
  return (
    <Navbar expand="lg" className="bg-body-light   shadow " >
      <Container>
        <Navbar.Brand >
          <Image
            src={logo}
            alt="Logo"
            height="70"
            width="70"
            
            
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto gap-4 fs-5 heading">
            
            <NavDropdown title={<span className="text-dark">Loans</span>} id="basic-nav-dropdown"   >
              <NavDropdown.Item  href="#action/3.1">Home Loans</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Plot Loans
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">NRI Loans</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">House Renovations Loans</NavDropdown.Item>
                </NavDropdown>
            <NavDropdown title={<span className="text-dark">Calculators</span>} id="basic-nav-dropdown" >
              <NavDropdown.Item href="#action/3.1">EMI Calculator</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
               Eligibility calculator
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Affordability Calculator</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">House Renovations Loans</NavDropdown.Item>
             
            </NavDropdown>
               <Nav.Link className='text-dark' href="#home">About us</Nav.Link>
               <Nav.Link className='text-dark' href="#home">Contact us</Nav.Link>
          </Nav>
           <Button className='me-4 px-3 blue-color'>Apply</Button>
         <Button  variant='outline-primary'>Sign In</Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;