import puppeteer from 'puppeteer-core';

async function summarizeYouTubeVideo(url) {
    const browser = await puppeteer.launch({
        executablePath: 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe', // Path to Brave browser executable
        headless: false // Set to true for production
    });
      
    const page = await browser.newPage();

    try {
        // Step 1: Get transcript from YouTube
        await page.goto('https://notegpt.io/youtube-video-summarizer');
        await page.type('input[placeholder="https://www.youtube.com/watch?v=tTJSNUQlabY"]', url);
        await page.click('button.el-button.ng-script-btn.el-button--success');
        await page.waitForSelector('i.el-icon-copy-document', { timeout: 60000 });
        await page.click('i.el-icon-copy-document');

        // Step 2: Summarize the transcript
        await page.goto('https://freesummarizer.com/summarize');
        
        // Clear the existing text in the input field
        await page.evaluate(() => {
            document.querySelector('#input_text').value = '';
        });

        const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());
        await page.type('#input_text', clipboardContent);
        await page.click('#btn-summarize');
        await page.waitForSelector('#summary', { timeout: 60000 });
        const summary = await page.$eval('#summary', el => el.innerText);

        return summary;
    } catch (error) {
        console.error('Error during scraping:', error);
        return '';
    } finally {
        await browser.close();
    }
}

export default summarizeYouTubeVideo;