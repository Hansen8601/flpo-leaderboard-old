import { useState, useEffect } from "react";
import axios from "axios";

export interface Entry {
  name: string;
  age_group: string;
  species: string;
  length: number;
  weight_lb: number;
  weight_oz: number;
  id: string;
  _rid: string;
  _self: string;
  _etag: string;
  _attachments: string;
  _ts: number;
}

export default function GetData() {

  //const [data, setData] = useState([]);
  const [data, setData] = useState<Entry[]>([]);
 
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/api/entryGet");
        setData(response.data);
      } catch (error) {
        console.error(error);
        setData([]);
      }
    }
    fetchData();
  }, []);

  //data.sort((a,b) => b.length - a.length);
  data.sort((a,b) => {
    if (a.species < b.species) {
      return -1;
    } else if (a.species > b.species) {
      return 1;
    } else {
      return b.length - a.length;
    }
  })
  
  return (
<div>

<h2>Adult</h2>
{data.filter((item) => item.age_group === 'Adult').length > 0 ? (
  // group data by species
  Object.entries(
    data.filter((item) => item.age_group === 'Adult').reduce<{[key: string]: Entry[]}>((acc, item) => {
        if (!acc[item.species]) acc[item.species] = [];
        acc[item.species].push(item);
        return acc;
      }, {})
  ).map(([species, items]) => (
    <div key={species}>
      <h3>{species}</h3>
      <ul>
        {items.map((item, index) => (
        <li key={item.id}>
          <h4>Record {index + 1}</h4>
          <p>Name: {item.name}</p>
          <p>Length: {item.length}</p>
          <p>Weight: {item.weight_lb} lb {item.weight_oz} oz</p>
        </li>
        ))}
      </ul>
    </div>
  ))
) : (
  <p>No data found for Adult.</p>
)}

<h2>Children</h2>
{data.filter((item) => item.age_group === 'Child').length > 0 ? (
  // group data by species
  Object.entries(
    data.filter((item) => item.age_group === 'Child').reduce<{[key: string]: Entry[]}>((acc, item) => {
        if (!acc[item.species]) acc[item.species] = [];
        acc[item.species].push(item);
        return acc;
      }, {})
  ).map(([species, items]) => (
    <div key={species}>
      <h3>{species}</h3>
      <ul>
        {items.map((item, index) => (
        <li key={item.id}>
          <p>Record {index + 1}</p>
          <p>Name: {item.name}</p>
          <p>Length: {item.length}</p>
          <p>Weight: {item.weight_lb} lb {item.weight_oz} oz</p>
        </li>
        ))}
      </ul>
    </div>
  ))
) : (
  <p>No data found for Children.</p>
)}
</div>
  );
}
