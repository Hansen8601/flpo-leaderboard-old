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

  const [data, setData] = useState<Entry[]>([]);
  const [message, setMessage] = useState("");
  //const [documentId, setId] = useState("");

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

  const handleDelete = async (documentId : string) => {
    //event.preventDefault();

    const id = documentId;

    try {
      await axios.post("/api/entryDelete", {
        id
      });
      
      // Remove the deleted item from the data array
      const newData = data.filter((item) => item.id !== id);

      // Update the state with the new data array
      setData(newData);

      setMessage("Data Deleted successfully!");
    } 
    catch (error) {
      console.error(error);
      setMessage("An error occurred while deleting the data.");
    }
  };


  return (
<div>

<h2>Adult</h2>
<table>
        <thead>
          <tr>
            <th>Species</th>
            <th>Record #</th>
            <th>Name</th>
            <th>Length</th>
            <th>Weight</th>
          </tr>
        </thead>

{data.filter((item) => item.age_group === 'Adult').length > 0 ? (
  // group data by species
  Object.entries(
    data.filter((item) => item.age_group === 'Adult').reduce<{[key: string]: Entry[]}>((acc, item) => {
        if (!acc[item.species]) acc[item.species] = [];
        acc[item.species].push(item);
        return acc;
      }, {})
  ).map(([species, items]) => (
        <tbody>
          {items.map((item, index) => (
          <tr key={item.id}>
            <td>{item.species}</td>
            <td>{index + 1}</td>
            <td>{item.name}</td>
            <td>{item.length}"</td>
            <td>{item.weight_lb} lb {item.weight_oz} oz</td>
            <td><button type="button" onClick={() => handleDelete(item.id)}>Delete</button></td>            
            <td><button type="button" onClick={() => window.location.reload()}>Refresh</button></td>
          </tr>
          ))}
        </tbody>
   
  ))
  ) : (
  <p>No data found for Adult.</p>
)}
  </table>
  <p>{message}</p>
</div>
  );
}
