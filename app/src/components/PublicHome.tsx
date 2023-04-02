import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Grid, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";


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
  <Box>
    <Typography variant="h4" gutterBottom>Adult</Typography>
    <Grid container spacing={4} className="grid-container">
      {data.filter((item) => item.age_group === 'Adult').length > 0 ? (
      // group data by species
        Object.entries(
        data.filter((item) => item.age_group === 'Adult').reduce<{[key: string]: Entry[]}>((acc, item) => {
            if (!acc[item.species]) acc[item.species] = [];
            acc[item.species].push(item);
            return acc;
          }, {})
        ).map(([species, items]) => (
          <Grid item xs={12} md={6} lg={4} key={species}>
          <Typography variant="h5">{species}</Typography>
          <List>
            {items.map((item, index) => (
              <ListItem key={item.id} disableGutters>
                <ListItemText>
                  <Typography variant="h6">Record {index + 1}</Typography>
                  <Typography>Name: {item.name}</Typography>
                  <Typography>Length: {item.length}</Typography>
                  <Typography>Weight: {item.weight_lb} lb {item.weight_oz} oz</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Grid>
      ))
    ) : (
      <p>No data found for Adult.</p>
    )}
  </Grid>

  <Typography variant="h4" gutterBottom>Children</Typography>
    <Grid container spacing={4} className="grid-container">
      {data.filter((item) => item.age_group === 'Child').length > 0 ? (
      // group data by species
        Object.entries(
        data.filter((item) => item.age_group === 'Child').reduce<{[key: string]: Entry[]}>((acc, item) => {
            if (!acc[item.species]) acc[item.species] = [];
            acc[item.species].push(item);
            return acc;
          }, {})
        ).map(([species, items]) => (
          <Grid item xs={12} md={6} lg={4} key={species}>
          <Typography variant="h5">{species}</Typography>
          <List>
            {items.map((item, index) => (
              <ListItem key={item.id} disableGutters>
                <ListItemText>
                  <Typography variant="h6">Record {index + 1}</Typography>
                  <Typography>Name: {item.name}</Typography>
                  <Typography>Length: {item.length}</Typography>
                  <Typography>Weight: {item.weight_lb} lb {item.weight_oz} oz</Typography>
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Grid>
      ))
      ) : (
      <p>No data found for Children.</p>
     )}
    </Grid>
  </Box>
  );
}
