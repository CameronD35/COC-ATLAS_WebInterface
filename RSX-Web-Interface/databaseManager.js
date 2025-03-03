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

// Updates the database with the new information provided
// Any columns without a provided value will have NULL pushed into them
function createInsertQuery(valueObj) {

    let keys = [];
    let values = [];
    

    for (key in valueObj) {
        keys.push(key);
        values.push(valueObj[key]);
    }

    let query = `INSERT INTO test (${keys.join(', ')}) VALUES (${values.join(', ')})`;

    //console.log(query);

    return query;
}

function createSearchQuery(table, timeframe, sessionID) {
    let lowerTimeLimit;

    let query = `SELECT temp, pres, cldpt, sesh_runtime FROM test WHERE temp > 30 LIMIT 3`;

    return query;
}

module.exports = {createTableQuery, createInsertQuery, createSearchQuery};