import { useState, useEffect } from "react";
import axios from "axios";

export interface Entry {
  name: string;
  age_group: string;
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
        const response = await axios.get("/api/entryGet?age_group=Adult");
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
    <h2>Get Data</h2>
    {data.length > 0 ? (
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <p>Name: {item.name}</p>
            <p>Age Group: {item.age_group}</p>
            <p>Length: {item.length}</p>
            <p>Weight: {item.weight_lb} lb {item.weight_oz} oz</p>
          </li>
        ))}
      </ul>
    ) : (
      <p>No data found.</p>
    )}
  </div>
  );
}
