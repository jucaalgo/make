
import axios from 'axios';
import fs from 'fs/promises';

async function main() {
    try {
        console.log("Fetching Google Sheets App Page...");
        const { data } = await axios.get('https://apps.make.com/google-sheets');
        await fs.writeFile('debug_app.html', data);
        console.log("✅ Saved to debug_app.html");
    } catch (error) {
        console.error("Error:", error);
    }
}
main();
