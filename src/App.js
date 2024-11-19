import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { BrowserRouter as Router , Routes, Route, Link } from "react-router-dom";
import MainWeatherUI from "./components/mainMainWeatherUI.component";

function App() {
  return (<Router>
    <Navbar>
      <Container className="d-flex justify-content-center fs-2 text-center">
          <span><span className="text-primary">Weather</span> in the <span className="text-primary">city</span></span>
      </Container>
    </Navbar>
    <Container className="mt-3">
      <Row>
        <Col md={12}>
          <Routes>
            <Route exact path='/' element={<MainWeatherUI />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  </Router>);
}
export default App;
