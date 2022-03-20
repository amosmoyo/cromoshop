import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import {useNavigate} from 'react-router-dom'

const Search = () => {
  const [sq, setSq] = useState("");

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    if(sq.trim()) {
        navigate(`/search/${sq}`)
    } else {
        navigate('/')
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit} style={{display: "flex"}}>
        <Form.Control
          type="text"
          name="q"
          placeholder="Search products..."
          className="ml-sm-2 mr-sm-2"
          value={sq}
          onChange={(e) => setSq(e.target.value)}
        ></Form.Control>
        <Button variant="outline-success" type="submit" className="p-2" style={{padding:"2px"}}>
          Search
        </Button>
      </Form>
    </>
  );
};

export default Search;
