import fs from 'fs';
//import path from 'path';

export function readDb(dbName = 'data.json') {
    // Read JSON object from file
    //const filePath = path.join(__dirname, dbName);
    const data = fs.readFileSync(dbName, 'utf-8');
    const parsed = JSON.parse(data);
    console.log('JLL_DEBUG what is the data???', parsed)
    return parsed;
}

export function writeDb(obj, dbName='data.json') {
    if (!obj) {
        return console.warn('No data provided to save.');
    }
    try {
        fs.writeFileSync(dbName, JSON.stringify(obj)); // Overwrite current data
        return console.log('SAVE SUCCESS');
    } catch (err) {
        return console.error(`FAILED TO SAVE TO DB: ${err}`);
    }
}