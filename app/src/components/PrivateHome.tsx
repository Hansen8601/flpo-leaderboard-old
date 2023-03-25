import React, {useEffect} from 'react';
import logo from '../logo.svg';
import { useState} from "react";
import axios from "axios";

export default function AddData(user) {
    const [name, setName] = useState("");
    const [age_group, setAge_Group] = useState("");
    const [species, setSpecies] = useState("");
    const [length, setLength] = useState("");
    const [weight_lb, setWeight_Lb] = useState("");
    const [weight_oz, setWeight_Oz] = useState("");
    const [message, setMessage] = useState("");
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        await axios.post("/api/entryInsert", {
          name,
          age_group,
          species,
          length,
          weight_lb,
          weight_oz
        });
  
        setMessage("Data added successfully!");
      } catch (error) {
        console.error(error);
        setMessage("An error occurred while adding the data.");
      }
    };
   
  
    return (
      <div>
        <h2>Add Data</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <br />
          <label>
            Age Group:
            <select value={age_group} onChange={(event) => setAge_Group(event.target.value)}>
              <option value="">--Select Age Group--</option>
              <option value="Adult">Adult</option>
              <option value="Child">Child</option>
            </select>
          </label>
          <br />
          <label>
            Species:
            <select value={species} onChange={(event) => setSpecies(event.target.value)}>
              <option value="">--Select Species--</option>            
              <option value="Northern Pike">Northern Pike</option>
              <option value="Perch">Perch</option>
              <option value="Walleye">Walleye</option>
            </select>          
          </label>
          <br />
          <label>
            Length:
            <input
              type="text"
              pattern="[0-9]*\.?[0-9]*"
              value={length}
              onChange={(event) => setLength(event.target.value)}
            />
          </label>
          <br />
          <label>
            Weight Lb:
            <input
              type="text"
              pattern="[0-9]*\.?[0-9]*"
              value={weight_lb}
              onChange={(event) => setWeight_Lb(event.target.value)}
            />
          </label>
          <br />
          <label>
            Weight Oz:
            <input
              type="text"
              pattern="[0-9]*\.?[0-9]*"
              value={weight_oz}
              onChange={(event) => setWeight_Oz(event.target.value)}
            />
          </label>
          <br />
          <button type="submit">Add Data</button>
        </form>
        <p>{message}</p>
      </div>
    );
  }