/**
 * Generates a default object from a JSON schema.
 * 
 * Fills in all default values and empty arrays/objects recursively.
 * 
 * @param schema JSON schema
 * @returns default object
 */
export function jsonSchemaGenerateDefaultObject(schema: any): any {
  if (schema.type === 'object') {
    const defaultObject: any = {};

    for (const propertyName in schema.properties) {
      if (schema.properties.hasOwnProperty(propertyName)) {
        const propertySchema = schema.properties[propertyName];

        if (propertySchema.hasOwnProperty('default')) {
          defaultObject[propertyName] = propertySchema.default;
        } else {
          defaultObject[propertyName] = jsonSchemaGenerateDefaultObject(propertySchema);
        }
      }
    }

    return defaultObject;
  } else if (schema.type === 'array') {
    if (schema.hasOwnProperty('default')) {
      return schema.default;
    } else if (schema.hasOwnProperty('items')) {
      return [jsonSchemaGenerateDefaultObject(schema.items)];
    } else {
      return [];
    }
  } else {
    if (schema.hasOwnProperty('default')) {
      return schema.default;
    } else {
      return undefined;
    }
  }
}

/** Upload JSON */
export function uploadJson(): Promise<any> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const json = JSON.parse(reader.result as string);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        };
        reader.readAsText(file);
      } else {
        reject('No file selected');
      }
    };
    input.click();
  });
}

/** Utility function for downloading files in the browser */
function downloadTextFile(content: string, mimeType: string, filename: string) {
  const a = document.createElement("a")
  a.href = URL.createObjectURL(
    new Blob([content], { type: mimeType })
  )
  a.download = filename;
  a.click()
  document.body.removeChild(a);
}

/**
 * Downloads a JSON file with the given name and content.
 * 
 * @param content JSON content.
 * @param filename Download filename. Will be sanitized and .json appended.
 */
export function downloadJson(content: string, filename: string) {
  downloadTextFile(content, "application/json", `${filename.replace(/\W/g, '_')}.json`);
}

/**
 * Downloads a CSV file with the given name and content.
 * 
 * @param csvString CSV content.
 * @param filename Download filename. Will be sanitized and .csv appended.
 */
export function downloadCsv(csvString: string, filename: string) {
  downloadTextFile(csvString, "text/csv", `${filename.replace(/\W/g, '_')}.csv`);
}

/**
 * Converts a table to a CSV string.
 * 
 * The table is an array of rows, where each row is an array of cells.
 * 
 * The CSV string will be quoted and escaped.
 * 
 * @param table Table to convert
 * @returns CSV string
 */
export function tableToCSV(table: any[][]): string {
  const csvRows: string[] = [];

  for (const row of table) {
    const csvRow = row.map((entry) => {
      if (typeof entry === 'string') {
        // Quote string values and escape any double quotes inside the string
        return `"${entry.replace(/"/g, '""')}"`;
      }
      return entry.toString();
    }).join(',');

    csvRows.push(csvRow);
  }

  return csvRows.join('\n');
}

/**
 * Counts the number of true values in an object.
 * 
 * @param obj Object to count
 * @returns Number of true values
 */
export function dictAllTrue(obj: { [key: string]: boolean }): boolean {
  return Object.values(obj).every(v => v === true);
}

/**
 * Returns a string representation of the fraction of true values in an object.
 * 
 * @param obj Object to count
 * @returns String representation of the fraction of true values
 */
export function dictFractionTrueString(obj: { [key: string]: boolean }): string {
  const total = Object.values(obj).length;
  const trueCount = Object.values(obj).filter(v => v === true).length;

  return `${trueCount}/${total}`;
}