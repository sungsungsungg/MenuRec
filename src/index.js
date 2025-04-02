import express from "express";
import pg from "pg";
import cors from 'cors';
import env from "dotenv";
import path from "path";
// Use CORS middleware to allow requests from port 5173
import { fileURLToPath } from 'url';
import { dirname } from 'path';




// Additional middleware and routes...
env.config({ path: '../.env' });

const app = express();
const port = process.env.PORT || 3000;



app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let db;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));

    // Catch-all handler for any unmatched routes (so React handles routing)
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });

    db = new pg.Client({
        connectionString: process.env.DATABASE_URL,
        ssl:{
            rejectUnauthorized: false
        },});

}else{
    app.use(express.static("public"));
    db = new pg.Client({
        user: process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        database: process.env.PG_DATABASE,
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
      });
}


  
db.connect();



async function getFoodList(search){
    let result;

    let lowerBound = parseInt(search.minPrice);
    let upperBound = parseInt(search.maxPrice);


    console.log(search);

    let ingredient = [];
    if(search.ingredient){
        if(search.ingredient==="meat"){

            ingredient = ["pork","beef","chicken","duck","steak","meat","lamb"];
        }else if(search.ingredient==="seafood"){
            ingredient = ["seafood","shrimp","fish","octopus","squid"];
        }else if(search.ingredient==="beef"){
            ingredient = ["beef","steak"];
        }else{
            ingredient = [search.ingredient];
        }
    }

    let category = [];
    if(search.category){
        if(search.category==="asian"){
            category = ["asian","korean","thai","vietnamese","chinese","szechuan","japanese","japacurry"]
        }else{
            category = [search.category];
        }
    }
        
    

    if(search.category && search.ingredient){ 
            result = await db.query(
                `SELECT *
                FROM menu_items
                JOIN restaurants ON restaurants.yelp_id = menu_items.restaurantid
                WHERE EXISTS (
                SELECT 1
                FROM jsonb_array_elements(categories) AS category
                WHERE category->>'alias' = ANY($1::text[])
                )
                AND ingredient && $2::text[]
                AND price >= $3
                AND price < $4
                AND earth_distance(
                    ll_to_earth(
                        (restaurants.coordinates->>'latitude')::double precision, 
                        (restaurants.coordinates->>'longitude')::double precision
                    ), 
                    ll_to_earth($5,$6) -- User's location
                ) <= 4828.03; -- 3 miles in meters
                ;`,[category,ingredient,lowerBound, upperBound, search.coordinates.lat, search.coordinates.lng]
            )
    }else if(search.category){
            result = await db.query(
                `SELECT *
                FROM menu_items
                JOIN restaurants ON restaurants.yelp_id = menu_items.restaurantid
                WHERE EXISTS (
                SELECT 1
                FROM jsonb_array_elements(categories) AS category
                WHERE category->>'alias' = ANY($1::text[])
                )
                AND price >= $2
                AND price < $3
                AND earth_distance(
                    ll_to_earth(
                        (restaurants.coordinates->>'latitude')::double precision, 
                        (restaurants.coordinates->>'longitude')::double precision
                    ), 
                    ll_to_earth($4,$5) -- User's location
                ) <= 4828.03; -- 3 miles in meters
                ;`,[category,lowerBound, upperBound, search.coordinates.lat,search.coordinates.lng]
            )
    }else if(search.ingredient){
            result = await db.query(
                `SELECT *
                FROM menu_items
                JOIN restaurants ON restaurants.yelp_id = menu_items.restaurantid
                WHERE ingredient && $1::text[]
                AND price >= $2
                AND price < $3
                AND earth_distance(
                    ll_to_earth(
                        (restaurants.coordinates->>'latitude')::double precision, 
                        (restaurants.coordinates->>'longitude')::double precision
                    ), 
                    ll_to_earth($4,$5) -- User's location
                ) <= 4828.03; -- 3 miles in meters;`,[ingredient,lowerBound, upperBound, search.coordinates.lat,search.coordinates.lng]
            )
    }else{
            result = await db.query(
                `SELECT *
                FROM menu_items
                JOIN restaurants ON restaurants.yelp_id = menu_items.restaurantid
                WHERE price >= $1
                AND price < $2
                AND earth_distance(
                    ll_to_earth(
                        (restaurants.coordinates->>'latitude')::double precision, 
                        (restaurants.coordinates->>'longitude')::double precision
                    ), 
                    ll_to_earth($3,$4) -- User's location
                ) <= 4828.03; -- 3 miles in meters;`,[lowerBound, upperBound, search.coordinates.lat,search.coordinates.lng]
            )
    }
    return result.rows;
}   
    

app.get('/api/items', (req, res) => {
    res.json([{ id: 1, name: 'Item 1' }]);
  });
  
app.post('/api/items', async (req, res) => {
    const newItem = req.body;
    // console.log(newItem);
    const result = await getFoodList(newItem);
    // console.log(result);
    res.json({ message: 'Item added', item: result });
});


app.post('/api/address', async (req, res) => {
    const newItem = req.body;
    console.log("This is New Address:", newItem);
    // console.log(result);
    res.json({ message: 'Address added', selectedAddress: newItem });
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

