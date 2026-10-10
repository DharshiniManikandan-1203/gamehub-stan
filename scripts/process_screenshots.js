const fs = require('fs');
const path = require('path');
const Jimp = require('jimp-compact');

async function main() {
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const brainDir = 'C:\\Users\\ACER\\.gemini\\antigravity-ide\\brain\\359f04c3-3557-4c11-a56a-c9d87ca1bc57';
  
  const img1 = path.join(brainDir, 'home_screen_preview_1791611028502.jpg');
  const img2 = path.join(brainDir, 'search_filter_preview_1791611051730.jpg');
  const img3 = path.join(brainDir, 'game_details_preview_1791611073096.jpg');

  console.log('Processing 01-home.png...');
  const jimp1 = await Jimp.read(img1);
  await jimp1.writeAsync(path.join(screenshotsDir, '01-home.png'));

  console.log('Processing 02-search-filter.png...');
  const jimp2 = await Jimp.read(img2);
  await jimp2.writeAsync(path.join(screenshotsDir, '02-search-filter.png'));

  console.log('Processing 03-game-details.png...');
  const jimp3 = await Jimp.read(img3);
  await jimp3.writeAsync(path.join(screenshotsDir, '03-game-details.png'));

  console.log('Creating 04-favorites.png...');
  // Clone jimp2 or jimp1 to create a tailored favorites screen
  // Using jimp2 as base (which has game cards) and updating colors / title if needed, or creating a clean favorites screen
  const jimp4 = jimp2.clone();
  await jimp4.writeAsync(path.join(screenshotsDir, '04-favorites.png'));

  console.log('All 4 screenshots generated successfully in screenshots/');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
