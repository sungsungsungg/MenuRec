import pg from 'pg';
import fs from 'fs';

// Read the JSON file
// const data = JSON.parse(fs.readFileSync('./Json_files/menus/lovemamaMenu.json', 'utf8'));

// PostgreSQL Client Setup
const client = new pg.Pool({
    user: "postgres",
    host: "localhost",
    database: "menurec",
    password: "rkdtjdgns12",
    port: 5432,
    max: 20,  // Set the maximum number of connections in the pool
    idleTimeoutMillis: 30000, // Connection timeout in milliseconds
    connectionTimeoutMillis: 2000,  // Timeout for acquiring a client
  });

  async function uploadData() {
    const data = JSON.parse(fs.readFileSync('../Json_files/menus/1-100/soothr.json', 'utf8'));

    if (Array.isArray(data)) {
        for (let menu of data) {
            const query = `
                INSERT INTO menu_items (
                    name, price, ingredient, restaurantid
                ) VALUES (
                    $1, $2, $3, $4
                )
                ON CONFLICT (name,restaurantID) DO NOTHING;  -- Ignore duplicate yelp_id
            `;
            const values = [
                menu.name, menu.price, menu.ingredient, menu.restaurantID
            ];

            try {
                // Using the pool to execute the query
                await client.query(query, values);
                console.log('Inserted:', menu.name);
            } catch (err) {
                console.error('Error inserting data:', err.stack);
            }
        }
    } else {
        console.log("Data is not an array. Please check your JSON format.");
    }

    // Close the pool after all inserts are done
    client.end();
}

// Call the function to start the process
uploadData();



