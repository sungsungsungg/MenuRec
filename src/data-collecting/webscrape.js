import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

scrapeMenu();

async function scrapeMenu() {
    const url = "https://www.soothrnyc.com/";  // URL to scrape
    try {
        // Send GET request to the website
        const response = await axios.get(url);
        const html = response.data;

        // Load the HTML into Cheerio for parsing
        const $ = cheerio.load(html);

        // Find menu items (adjust selectors based on website structure)
        const menuItems = [];
        $('.ci-item-menu').each((index, element) => {
            console.log("****************");
            // console.log(element);
            const menuName = $(element).find('.ci-item-menu-title').text().trim();
            const menuPrice = $(element).find('.ci-item-menu-price').text().trim();
            const menuIngredient = $(element).find('.small').text().trim().split(",");

            menuItems.push({
                name: menuName,
                price: menuPrice,
                ingredient: menuIngredient,
                restaurantID: "-XYp6w50XbZfS90YddS5ew",
            });
        });
        // console.log($('.panel-group'));
        fs.writeFileSync('soothr.json', JSON.stringify(menuItems, null, 2), 'utf8');
        console.log(menuItems);
    } catch (error) {
        console.error("Error scraping the site:", error);
    }
}
