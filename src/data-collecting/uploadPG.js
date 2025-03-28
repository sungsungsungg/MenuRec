import pg from 'pg';
import fs from 'fs';

// Read the JSON file
// const data = JSON.parse(fs.readFileSync('./Json_files/near-me.json', 'utf8'));

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
    // const data = JSON.parse(fs.readFileSync('../Json_files/restaurants/near-me11.json', 'utf8'));
    for(let i=1;i<=12;i++){
        const data = JSON.parse(fs.readFileSync(`../Json_files/restaurants/yorkville-files/yorkville${i}.json`, 'utf8'));

    if (Array.isArray(data)) {
        for (let business of data) {
            const query = `
                INSERT INTO restaurants (
                    yelp_id, restaurant_name, categories, url, review_count, 
                    rating, coordinates, transactions, price_restaurant, location, phone, 
                    display_phone, business_hours, attributes
                ) VALUES (
                    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
                )
                ON CONFLICT (yelp_id) DO NOTHING;  -- Ignore duplicate yelp_id
            `;
            const values = [
                business.id, business.name, JSON.stringify(business.categories),
                business.url, business.review_count, business.rating,
                JSON.stringify(business.coordinates), business.transactions,
                business.price, JSON.stringify(business.location), business.phone,
                business.display_phone, JSON.stringify(business.business_hours),
                JSON.stringify(business.attributes)
            ];

            try {
                // Using the pool to execute the query
                await client.query(query, values);
                console.log('Inserted:', business.name);
            } catch (err) {
                console.error('Error inserting data:', err.stack);
            }
        }
    } else {
        console.log("Data is not an array. Please check your JSON format.");
    }

    }

    

    // Close the pool after all inserts are done
    client.end();
}

// Call the function to start the process
uploadData();



