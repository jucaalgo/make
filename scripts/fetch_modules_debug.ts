
import axios from 'axios';
import fs from 'fs/promises';

async function main() {
    try {
        console.log("Fetching Google Sheets App Page...");
        const { data } = await axios.get('https://apps.make.com/google-sheets-modules');
        await fs.writeFile('debug_modules.html', data);
        console.log("✅ Saved to debug_modules.html");
    } catch (error) {
        console.error("Error:", error);
    }
}
main();
