import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';

const Test = () => {
    const [message, setMessage] = useState("...Loading...");
    const API_URL = import.meta.env.VITE_API_URL;
    async function fetchData() {
      const result = await fetch(API_URL + '/api/hello');
      const data = await result.json();
      console.log("result: ", result);
      console.log("data:", data);
      setMessage(data.message);
    }
    useEffect(() => {
      fetchData();
    }, []);
    return (
      <div>
        TESTSSS
        Message: {message}
      </div>
    )
}

export default Test