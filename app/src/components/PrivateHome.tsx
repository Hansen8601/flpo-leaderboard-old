import { useState, useEffect } from "react";
import axios from "axios";
import React from 'react';
import { Button, Grid, FormControl, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, TextField } from '@mui/material';

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

      setData([...data, response.data]);

      setMessage("Data saved successfully!");
      setName("");
      setAgeGroup("");
      setSpecies("");
      setLength(0);
      setWeightLb(0);
      setWeightOz(0);
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while saving the data.");
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

  return (

    <div>
  <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Add Data
      </Typography>

      <form onSubmit={handleInsert}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                label="Age Group"
                value={age_group}
                onChange={(event) => setAgeGroup(event.target.value)}
              >
                <MenuItem value="">
                  --Select Age Group--
                </MenuItem>
                <MenuItem value="Adult">Adult</MenuItem>
                <MenuItem value="Child">Child</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <TextField
                select
                label="Species"
                value={species}
                onChange={(event) => setSpecies(event.target.value)}
              >
                <MenuItem value="">
                  --Select Species--
                </MenuItem>
                <MenuItem value="Northern Pike">Northern Pike</MenuItem>
                <MenuItem value="Perch">Perch</MenuItem>
                <MenuItem value="Walleye">Walleye</MenuItem>
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Length"
              type="number"
              inputProps={{ step: '0.01' }}
              value={length}
              onChange={(event) => setLength(parseFloat(event.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Weight Lb"
              type="number"
              inputProps={{ step: '0.01' }}
              value={weight_lb}
              onChange={(event) => setWeightLb(parseFloat(event.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Weight Oz"
              type="number"
              inputProps={{ step: '0.01' }}
              value={weight_oz}
              onChange={(event) => setWeightOz(parseFloat(event.target.value))}
              fullWidth
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained">
              Save Entry
            </Button>
          </Grid>
        </Grid>
      </form>

      <Typography variant="body1" component="p" gutterBottom>
        {message}
      </Typography>
    </div>

    <div>
      <Typography variant="h4" component="h2" gutterBottom>
        Adult
      </Typography>

      <TextField
        label="Search"
        variant="outlined"
        style={{ marginBottom: '1rem' }}
        onChange={(e) => {
          // handle search logic here
        }}
      />

      <TableContainer className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Species</TableCell>
              <TableCell>Record #</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Weight</TableCell>
            </TableRow>
          </TableHead>

          {data.filter((item) => item.age_group === 'Adult').length > 0 ? (
            // group data by species
            Object.entries(
              data.filter((item) => item.age_group === 'Adult').reduce<{ [key: string]: Entry[] }>((acc, item) => {
                if (!acc[item.species]) acc[item.species] = [];
                acc[item.species].push(item);
                return acc;
              }, {})
            ).map(([species, items]) => (
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.species}</TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.length}"</TableCell>
                    <TableCell>{item.weight_lb} lb {item.weight_oz} oz</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleDelete(item.id)}  >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ))
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>no data found for Adult.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>


      <Typography variant="h4" component="h2" gutterBottom>
        Children
      </Typography>
      <TableContainer className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Species</TableCell>
              <TableCell>Record #</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Weight</TableCell>
            </TableRow>
          </TableHead>

          {data.filter((item) => item.age_group === 'Child').length > 0 ? (
            // group data by species
            Object.entries(
              data.filter((item) => item.age_group === 'Child').reduce<{ [key: string]: Entry[] }>((acc, item) => {
                if (!acc[item.species]) acc[item.species] = [];
                acc[item.species].push(item);
                return acc;
              }, {})
            ).map(([species, items]) => (
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.species}</TableCell>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.length}"</TableCell>
                    <TableCell>{item.weight_lb} lb {item.weight_oz} oz</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => handleDelete(item.id)}  >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ))
          ) : (
            <TableBody>
              <TableRow>
                <TableCell>no data found for Children.</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </TableContainer>      
    </div>
</div>  
);
}
