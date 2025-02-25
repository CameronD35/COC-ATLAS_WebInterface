// create a table in a postgresql database
function createTableQuery(tableName=null, dataObj=null) {
    
    // REAL is 6 decimal-point precision
    // NUMERIC (4, 2) has up to 2 decimal point precision (4 byte size)
    // NUMERIC (3, 1) has up to 1 decimal point precision (2 byte size)
    
    const query = `
    CREATE TABLE IF NOT EXISTS test (
    id SERIAL PRIMARY KEY,
    temp REAL,
    pres REAL,
    cldpt INTEGER,
    ram NUMERIC(4, 2),
    cpu NUMERIC(3, 1) 
    );
    `

    return query;
}

module.exports = {createTableQuery};