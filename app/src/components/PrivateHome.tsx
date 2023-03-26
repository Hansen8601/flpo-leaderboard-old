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

export default function PrivateHome(user) {
  const [data, setData] = useState<Entry[]>([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [age_group, setAgeGroup] = useState("");
  const [species, setSpecies] = useState("");
  const [length, setLength] = useState(0);
  const [weight_lb, setWeightLb] = useState(0);
  const [weight_oz, setWeightOz] = useState(0);

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

  const handleDelete = async (documentId: string) => {
    const id = documentId;

    try {
      await axios.post("/api/entryDelete", {
        id,
      });

      setData((prevData) => prevData.filter((item) => item.id !== id));
      setMessage("Data Deleted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while deleting the data.");
    }
  };

  const handleInsert = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post("/api/entryInsert", {
        name,
        age_group,
        species,
        length,
        weight_lb,
        weight_oz,
      });
  
      console.log(response.data)
      setData([...data, response.data]);

      setMessage("Data added successfully!");
      setName("");
      setAgeGroup("");
      setSpecies("");
      setLength(0);
      setWeightLb(0);
      setWeightOz(0);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while adding the data.");
    }
  };

   data.sort((a, b) => {
    if (a.species < b.species) {
      return -1;
    } else if (a.species > b.species) {
      return 1;
    } else {
      return b.length - a.length;
    }
  }); 

/*   useEffect(() => {
    // Sort the data array
    data.sort((a, b) => {
      if (a.species < b.species) {
        return -1;
      } else if (a.species > b.species) {
        return 1;
      } else {
        return b.length - a.length;
      }
    });
  }, [data]); */

  return (

    <div>
        <div>
            <h2>Add Data</h2>
            <form onSubmit={handleInsert}>
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
                <select value={age_group} onChange={(event) => setAgeGroup(event.target.value)}>
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
                onChange={(event) => setLength(parseFloat(event.target.value))}
                />
            </label>
            <br />
            <label>
                Weight Lb:
                <input
                type="text"
                pattern="[0-9]*\.?[0-9]*"
                value={weight_lb}
                onChange={(event) => setWeightLb(parseFloat(event.target.value))}
                />
            </label>
            <br />
            <label>
                Weight Oz:
                <input
                type="text"
                pattern="[0-9]*\.?[0-9]*"
                value={weight_oz}
                onChange={(event) => setWeightOz(parseFloat(event.target.value))}
                />
            </label>
            <br />
            <button type="submit">Add Data</button>
            </form>
            <p>{message}</p>
        </div>

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
</div>  
);
}
