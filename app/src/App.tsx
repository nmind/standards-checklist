import { createAjv } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/react";
import { useState } from "react";

import "./App.css";

import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import check from "./schema.json";

// material design button component
import {
  AppBar,
  Box,
  Button,
  Container,
  Modal,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  downloadCsv,
  downloadJson,
  jsonSchemaGenerateDefaultObject,
  submitJson,
  tableToCSV,
  uploadJson,
} from "./utils";

import CustomCheckboxRenderer, {
  CustomCheckboxControlTester,
} from "./CheckboxRenderer";
import CustomGroupRenderer, { CustomGroupTester } from "./GroupRenderer";

import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";

import logo from "./logo192.png";

/** Convert data object to table */
function dataToTable(obj: any): any[][] {
  const header = ["section", "tier", "item", "value"];
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
  const [modalState, setModalState] = useState({
    export: false,
    import: false,
  });
  const [textareaValue, setTextareaValue] = useState("");

  const handleModalOpen = (modal: "export" | "import") => {
    setModalState((prevState) => ({ ...prevState, [modal]: true }));
  };
  const handleModalClose = (modal: "export" | "import") => {
    setModalState((prevState) => ({ ...prevState, [modal]: false }));
  };

  const uiSchema = {
    type: "VerticalLayout",
    elements: [
      {
        type: "Control",
        scope: "#/properties/name",
      },
      {
        type: "Control",
        scope: "#/properties/urls",
      },
      {
        type: "Control",
        scope: "#/properties/documentation",
      },
      {
        type: "Control",
        scope: "#/properties/infrastructure",
      },
      {
        type: "Control",
        scope: "#/properties/testing",
      },
    ],
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const THEME: Partial<Theme> = createTheme({
    typography: {
      fontFamily: ["Montserrat", "sans-serif"].join(","),
    },
  });

  return (
    <ThemeProvider theme={THEME}>
      <AppBar position="static" color="transparent">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography variant="h6" noWrap component="div" fontWeight={700}>
              <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
                <img
                  src={logo}
                  alt="NMIND Logo"
                  style={{
                    height: "3em",
                    display: "inline-block",
                    verticalAlign: "middle",
                    paddingRight: "0.5em",
                  }}
                />
                NMIND Coding Standards Checklist
              </a>
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
      <div className="App">
        <JsonForms
          schema={check}
          data={data}
          renderers={[
            ...materialRenderers,
            { tester: CustomGroupTester, renderer: CustomGroupRenderer },
            {
              tester: CustomCheckboxControlTester,
              renderer: CustomCheckboxRenderer,
            },
          ]}
          cells={materialCells}
          onChange={({ data, errors }) => setData(data)}
          ajv={handleDefaultsAjv}
          uischema={uiSchema}
        />
        <h2>Data</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Export */}
            <Button
              variant="contained"
              onClick={() => handleModalOpen("export")}
            >
              Export
            </Button>
            <Modal
              open={modalState.export}
              onClose={() => handleModalClose("export")}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <h2>Export checklist</h2>
                <p>
                  Save the completed checklist as one of the following file
                  types.
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <Button
                      variant="contained"
                      onClick={() => {
                        downloadJson(
                          JSON.stringify(data, null, 2),
                          data?.name ? "checklist-" + data?.name : "checklist"
                        );
                        handleModalClose("export");
                      }}
                    >
                      JSON
                    </Button>
                    <Button
                      sx={{ marginLeft: 1 }}
                      variant="contained"
                      onClick={() => {
                        downloadCsv(
                          tableToCSV(dataToTable(data)),
                          data?.name ? "checklist-" + data?.name : "checklist"
                        );
                        handleModalClose("export");
                      }}
                    >
                      CSV
                    </Button>
                    <Button
                      sx={{ marginLeft: 1 }}
                      variant="contained"
                      onClick={() => {
                        const dataString = JSON.stringify(data, null, 2);
                        navigator.clipboard.writeText(dataString).then(
                          () => {
                            alert("Checklist copied!");
                            handleModalClose('export');
                          },
                          (err) => {
                            console.error("Error copying data to clipboard: ", err);
                          }
                        );
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <Button
                    variant="outlined"
                    onClick={() => handleModalClose("export")}
                    sx={{
                      position: "relative",
                      right: 16,
                      transition: "background-color 0.1s ease, color 0.1s ease",
                      "&:hover": {
                        backgroundColor: "#1976D2",
                        color: "#fff",
                      },
                    }}
                  >
                    <strong>Close</strong>
                  </Button>
                </div>
              </Box>
            </Modal>
            {/* Import */}
            <span style={{ paddingLeft: "1em" }} />
            <Button
              variant="contained"
              onClick={() => handleModalOpen("import")}
            >
              Import
            </Button>
            <Modal
              open={modalState.import}
              onClose={() => handleModalClose("import")}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={modalStyle}>
                <h2>Import checklist</h2>
                <p>
                  Render a completed checklist from file, by string, or from URL
                  from a submitted checklist
                </p>
                <Button
                  variant="contained"
                  onClick={async () => {
                    const json = await uploadJson();
                    if (json) {
                      setTextareaValue(json);
                    }
                  }}
                  fullWidth
                  sx={{ marginBottom: 2 }}
                  component="label"
                >
                  From JSON File
                </Button>
                <textarea
                  placeholder="Enter checklist / import from JSON file"
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                  style={{
                    width: "100%",
                    height: "200px",
                    marginTop: "8px",
                    marginBottom: "8px",
                    borderRadius: "4px",
                    resize: "none",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={() => {
                      try {
                        setData(JSON.parse(textareaValue));
                        handleModalClose("import");
                      } catch (err) {
                        console.log(err);
                      }
                    }}
                  >
                    Upload
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => handleModalClose("import")}
                    sx={{
                      transition: "background-color 0.1s ease, color 0.1s ease",
                      "&:hover": {
                        backgroundColor: "#1976D2",
                        color: "#fff",
                      },
                    }}
                  >
                    <strong>Close</strong>
                  </Button>
                </div>
              </Box>
            </Modal>
          </div>
          <div>
            <Button
              variant="outlined"
              onClick={() => submitJson(data)}
              sx={{
                transition: "background-color 0.1s ease, color 0.1s ease",
                "&:hover": {
                  backgroundColor: "#1976D2",
                  color: "#fff",
                },
              }}
            >
              <strong>Submit</strong>
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
