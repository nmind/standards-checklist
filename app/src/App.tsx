import React, { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { createAjv } from '@jsonforms/core';

import './App.css';

import check from './schema.json';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';

// material design button component
import { Button, AppBar, Container, Toolbar, Typography } from '@mui/material';

import { downloadJson, downloadCsv, tableToCSV, jsonSchemaGenerateDefaultObject, uploadJson } from './utils';

import CustomGroupRenderer, { CustomGroupTester } from './GroupRenderer';
import CustomCheckboxRenderer, { CustomCheckboxControlTester } from './CheckboxRenderer';

import { Theme, ThemeProvider, createTheme } from '@mui/material/styles';

import logo from './logo192.png';

/** Convert data object to table */
function dataToTable(obj: any): any[][] {
  const header = ["section", "tier", "item", "value"]
  const entries: any[][] = [header];

  for (const category in obj) {
    if (category === "urls" || category === "name") {
      continue;
    }
    for (const subCategory in obj[category]) {
      for (const key in obj[category][subCategory]) {
        const value = obj[category][subCategory][key];
        entries.push([category, subCategory, key, value]);
      }
    }
  }
  return entries;
}

function App() {
  const initialData = jsonSchemaGenerateDefaultObject(check);
  const [data, setData] = useState(initialData);
  const handleDefaultsAjv = createAjv({ useDefaults: true });

  const uiSchema = {
    "type": "VerticalLayout",
    "elements": [
      {
        "type": "Control",
        "scope": "#/properties/name"
      },
      {
        "type": "Control",
        "scope": "#/properties/urls"
      },
      {
        "type": "Control",
        "scope": "#/properties/documentation"
      },
      {
        "type": "Control",
        "scope": "#/properties/infrastructure"
      },
      {
        "type": "Control",
        "scope": "#/properties/testing"
      }
    ]
  };

  const THEME: Partial<Theme> = createTheme({
    typography: {
      fontFamily: ['Montserrat', "sans-serif"].join(','),
    },
  });


  return (
    <ThemeProvider theme={THEME}>
      <AppBar position="static" color='transparent'>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="div"
              fontWeight={700}
            >
              <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
                <img src={logo} alt="NMIND Logo" style={{
                  "height": "3em",
                  "display": "inline-block",
                  "verticalAlign": "middle",
                  "paddingRight": "0.5em"
                }} />
                NMIND Coding Standards Checklist</a>
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <div className="App">
        <JsonForms
          schema={check}
          data={data}
          renderers={[...materialRenderers, 
            { tester: CustomGroupTester, renderer: CustomGroupRenderer },
            { tester: CustomCheckboxControlTester, renderer: CustomCheckboxRenderer }
          
          ]}
          cells={materialCells}
          onChange={({ data, errors }) => setData(data)}
          ajv={handleDefaultsAjv}
          uischema={uiSchema}
        />
        <h2>Data</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button variant="contained" onClick={() => downloadJson(JSON.stringify(data, null, 2), data?.name ? "checklist-" + data?.name : "checklist")}>
            Export JSON
          </Button>
          <span style={{ paddingLeft: "1em" }} />
          <Button variant="contained" onClick={() => downloadCsv(tableToCSV(dataToTable(data)), data?.name ? "checklist-" + data?.name : "checklist")}>
            Export CSV
          </Button>
          <span style={{ paddingLeft: "1em" }} />
          <Button variant="contained" onClick={async () => {
            const json = await uploadJson();
            if (json) {
              setData(json);
            }
          }}>
            Import JSON
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
