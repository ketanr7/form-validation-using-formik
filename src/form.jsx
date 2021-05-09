import React,{useState} from 'react';
import { Form, Col, Button, InputGroup, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { FaChevronDown } from 'react-icons/fa';
import SuccessModal from './modal'
import Loader from './loader'
import './form.css'
const schema = Yup.object().shape({
  salutation: Yup.string().oneOf(
    ['Mr', 'Ms', 'Mrs'],
    'Invalid salutation'
  )
    .required('Salutation is a required field'),
  firstName: Yup.string().required('First name is a required field').max(30)
    .matches(/^[a-zA-Z]+$/, "Must be only character"),
  middleName: Yup.string().required('Middle name is a required field').max(30)
    .matches(/^[a-zA-Z]+$/, "Must be only character"),
  lastName: Yup.string().required('Last name is a required field').max(30)
    .matches(/^[a-zA-Z]+$/, "Must be only character"),
  gender: Yup.string().oneOf(
    ['Male', 'Female'],
    'Invalid gender'
  )
    .required('Gender is a required field'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is a required field'),
  mobile: Yup.string('Mobile number must be number').required('Mobile number is a required field')
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, 'Mobile number must be exactly 10 digits')
    .max(10, 'Mobile number must be exactly 10 digits'),
  birthDate: Yup.string().required('Date of birth is a required field')
    .test("birthDate", "You must be 18 or older", (userdob) => {
      const userAge = new Date(userdob);
      const now = new Date();
      const currentYear = now.getFullYear();
      const year_diff = currentYear - userAge.getFullYear();
      const birthday_this_year = new Date(currentYear, userAge.getMonth(), userAge.getDate());
      const has_had_birthday_this_year = (now >= birthday_this_year);
      const age = has_had_birthday_this_year
        ? year_diff
        : year_diff - 1;
      return age >= 18;
    }),
  occupation: Yup.string().oneOf(
    ['Salaried', 'Business', 'Student'],
    'Invalid occupation'
  )
    .required('Occupation is a required field'),
  income: Yup.string('Annual Income must be number').required('Annual Income is a required field')
    .matches(/^[0-9]+$/, "Must be only digits")
    .test("income", "Annual Income must be between 500000 to 2500000", (incomeInfo) => {
      if (incomeInfo > 500000 && incomeInfo < 2500000) {
        return true
      }
    }),
  panCard: Yup.string().required('Pan card number is a required field')
    .test("panCard", "Invalid pan card number", (panCard) => {
      const panRegs = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
      if (panRegs.test(panCard)) {
        return true
      }
    }),
  maritalStatus: Yup.string().oneOf(
    ['single', 'married', 'divorced', 'widowed'],
    'Invalid marital status'
  )
    .required('Marital status is a required field'),
  height: Yup.string().required('Height is a required field').min(2).max(10)
    .matches(/^([1-9]){1}[0-9]+$/, "Must be only digits"),
  weight: Yup.string().required('Weight is a required field').min(2).max(10)
    .matches(/^([1-9]){1}[0-9]+$/, "Must be only digits"),
  nomineeFirstName: Yup.string().required('First name is a required field').max(30)
    .matches(/^[a-zA-Z]+$/, "Must be only character"),
  nomineeMiddleName: Yup.string().required('Middle name is a required field').max(30)
    .matches(/^[a-zA-Z]+$/, "Must be only character"),
  nomineeLastName: Yup.string().required('Last name is a required field').max(30)
    .matches(/^[a-zA-Z]+$/, "Must be only character"),
  relationship: Yup.string().oneOf(
    ['father', 'mother', 'sisiter', 'brother'],
    'Invalid relation'
  )
    .required('Relationship is a required field'),
  nomineeBirthDate: Yup.string().required('Date of birth is a required field')
    .test("nomineeBirthDate", "You must be 18 or older", (nomineedob) => {
      const userAge = new Date(nomineedob);
      const now = new Date();
      const currentYear = now.getFullYear();
      const year_diff = currentYear - userAge.getFullYear();
      const birthday_this_year = new Date(currentYear, userAge.getMonth(), userAge.getDate());
      const has_had_birthday_this_year = (now >= birthday_this_year);
      const age = has_had_birthday_this_year
        ? year_diff
        : year_diff - 1;
      return age >= 18;
    }),
  nomineeGender: Yup.string().oneOf(
    ['Male', 'Female'],
    'Invalid gender'
  )
    .required('Gender is a required field')
});
function FormExample() {
  const [modalShow, setModalShow] = useState(false);
  const [loading, setLoading] = useState(false);
  if (loading) {
    return (
      <Loader />
    )
  }
  return (
  	<>
    <Formik
      validationSchema={schema}
      initialValues={{
        salutation: '',
        firstName: '',
        middleName: '',
        lastName: '',
        gender: '',
        email: '',
        mobile: '',
        birthDate: '',
        occupation: '',
        income: '',
        panCard: '',
        maritalStatus: '',
        height: '',
        weight: '',
        nomineeFirstName: '',
        nomineeMiddleName: '',
        nomineeLastName: '',
        relationship: '',
        nomineeBirthDate: '',
        nomineeGender: ''
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        // alert(JSON.stringify(values))
        setLoading(true)
        const data = { name: values.firstName+values.middleName+values.lastName, movies:[values] }
        const response = await axios.post('https://reqres.in/api/users', { data: data })
        if(response.data.id){
          setModalShow(true);
          setSubmitting(false);
          resetForm();
          setLoading(false) 
        }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        resetForm,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <Form noValidate onSubmit={handleSubmit} className="formExample">
          <Row>
            <Col xs={12} md={3} lg={3} className="proposerDetails">Proposer Details</Col>
            <Col xs={12} md={9} lg={9} className="proposerForm">
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Salutation</Form.Label>
                  <InputGroup hasValidation>
	                  <Form.Control as="select" 
	                    name="salutation" value={values.salutation} onChange={handleChange}
	                    isInvalid={!!errors.salutation}>
	                    <option value="">Select salutation</option>
	                    <option value="Mr">Mr</option>
	                    <option value="Ms">Ms</option>
	                    <option value="Mrs">Mrs</option>
	                  </Form.Control>
	                  <span className="input-group-text"><FaChevronDown /></span>
	                  <Form.Control.Feedback type="invalid">
	                    {errors.salutation}
	                  </Form.Control.Feedback>
                   </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    isInvalid={!!errors.firstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Middle Name"
                    name="middleName"
                    value={values.middleName}
                    onChange={handleChange}
                    isInvalid={!!errors.middleName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.middleName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    isInvalid={!!errors.lastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Gender</Form.Label>
                  <InputGroup hasValidation>
	                  <Form.Control as="select" placeholder="Gender"
	                    name="gender" value={values.gender} onChange={handleChange}
	                    isInvalid={!!errors.gender}>
	                    <option value="">Select gender</option>
	                    <option value="Male">Male</option>
	                    <option value="Female">Female</option>
	                  </Form.Control>
	                  <span className="input-group-text"><FaChevronDown /></span>
	                  <Form.Control.Feedback type="invalid">
	                    {errors.gender}
	                  </Form.Control.Feedback>
	              </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Email ID</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="ketan@gmail.com"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Mobile</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Mobile Number"
                    name="mobile"
                    value={values.mobile}
                    onChange={handleChange}
                    isInvalid={!!errors.mobile}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.mobile}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Date of Birth"
                    name="birthDate"
                    value={values.birthDate}
                    onChange={handleChange}
                    isInvalid={!!errors.birthDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.birthDate}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Occupation</Form.Label>
                  <InputGroup hasValidation>
	                  <Form.Control as="select" placeholder="Occupation"
	                    name="occupation" value={values.occupation} onChange={handleChange}
	                    isInvalid={!!errors.occupation}>
	                    <option value="">Select occupation</option>
	                    <option value="Salaried">Salaried</option>
	                    <option value="Business">Business</option>
	                    <option value="Student">Student</option>
	                  </Form.Control>
	                  <span className="input-group-text"><FaChevronDown /></span>
	                  <Form.Control.Feedback type="invalid">
	                    {errors.occupation}
	                  </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Annual Income</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="1000000"
                    name="income"
                    value={values.income}
                    onChange={handleChange}
                    isInvalid={!!errors.income}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.income}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Pan Card</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pan Card"
                    name="panCard"
                    value={values.panCard}
                    onChange={handleChange}
                    isInvalid={!!errors.panCard}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.panCard}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Marital Status</Form.Label>
                  <InputGroup hasValidation>
	                  <Form.Control as="select" placeholder="Marital Status"
	                    name="maritalStatus" value={values.maritalStatus} onChange={handleChange}
	                    isInvalid={!!errors.maritalStatus}>
	                    <option value="">Select marital status</option>
	                    <option value="single">Single</option>
	                    <option value="married">Married</option>
	                    <option value="divorced">Divorced</option>
	                    <option value="widowed">Widowed</option>
	                  </Form.Control>
	                  <span className="input-group-text"><FaChevronDown /></span>
	                  <Form.Control.Feedback type="invalid">
	                    {errors.maritalStatus}
	                  </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Height</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Height in cms"
                    name="height"
                    value={values.height}
                    onChange={handleChange}
                    isInvalid={!!errors.height}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.height}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Weight in kilograms"
                    name="weight"
                    value={values.weight}
                    onChange={handleChange}
                    isInvalid={!!errors.weight}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.weight}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col xs={12} md={3} lg={3} className="nomineeDetails">Nominee Details</Col>
            <Col xs={12} md={9} lg={9} className="nomineeForm">
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="nomineeFirstName"
                    value={values.nomineeFirstName}
                    onChange={handleChange}
                    isInvalid={!!errors.nomineeFirstName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nomineeFirstName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Middle Name"
                    name="nomineeMiddleName"
                    value={values.nomineeMiddleName}
                    onChange={handleChange}
                    isInvalid={!!errors.nomineeMiddleName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nomineeMiddleName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="nomineeLastName"
                    value={values.nomineeLastName}
                    onChange={handleChange}
                    isInvalid={!!errors.nomineeLastName}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nomineeLastName}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Relationship</Form.Label>
                  <InputGroup hasValidation>
	                  <Form.Control as="select" placeholder="Relationship"
	                    name="relationship" value={values.relationship} onChange={handleChange}
	                    isInvalid={!!errors.relationship}>
	                    <option value="">Select relation</option>
	                    <option value="father">Father</option>
	                    <option value="mother">Mother</option>
	                    <option value="sister">Sister</option>
	                    <option value="brother">Brother</option>
	                  </Form.Control>
	                  <span className="input-group-text"><FaChevronDown /></span>
	                  <Form.Control.Feedback type="invalid">
	                    {errors.relationship}
	                  </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
              <Row>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder="Date of Birth"
                    name="nomineeBirthDate"
                    value={values.nomineeBirthDate}
                    onChange={handleChange}
                    isInvalid={!!errors.nomineeBirthDate}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.nomineeBirthDate}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" >
                  <Form.Label>Gender</Form.Label>
                  <InputGroup hasValidation>
	                  <Form.Control as="select" placeholder="Gender"
	                    name="nomineeGender" value={values.nomineeGender} onChange={handleChange}
	                    isInvalid={!!errors.nomineeGender}>
	                    <option value="">Select gender</option>
	                    <option value="Male">Male</option>
	                    <option value="Female">Female</option>
	                  </Form.Control>
	                  <span className="input-group-text"><FaChevronDown /></span>
	                  <Form.Control.Feedback type="invalid">
	                    {errors.nomineeGender}
	                  </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col className="buttonContainer">
              <Button type="button" className="clearBtn" onClick={resetForm}>Clear</Button>
              <Button type="submit" className="continueBtn">Continue</Button>
            </Col>
          </Row>
        </Form>     
      )}
    </Formik>
     <SuccessModal
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </>
  )
}
export default FormExample;