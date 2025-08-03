const { chromium } = require('playwright');

async function debugConsole() {
    console.log('🔍 Starting Playwright console debugging...');
    
    const browser = await chromium.launch({ 
        headless: false,  // Show browser
        devtools: true    // Open devtools
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Listen to console messages
    page.on('console', msg => {
        const type = msg.type();
        const text = msg.text();
        console.log(`📄 Console ${type}: ${text}`);
    });
    
    // Listen to page errors
    page.on('pageerror', error => {
        console.log(`❌ Page Error: ${error.message}`);
    });
    
    // Listen to request failures
    page.on('requestfailed', request => {
        console.log(`🚫 Request Failed: ${request.url()} - ${request.failure().errorText}`);
    });
    
    try {
        console.log('🌐 Navigating to http://localhost:3001...');
        await page.goto('http://localhost:3001', { 
            waitUntil: 'networkidle',
            timeout: 10000 
        });
        
        // Wait for page to load
        await page.waitForTimeout(2000);
        
        // Check if Firebase loaded
        const firebaseLoaded = await page.evaluate(() => {
            return typeof window.firebaseAuth !== 'undefined';
        });
        console.log(`🔥 Firebase loaded: ${firebaseLoaded}`);
        
        // Check for sign in button
        const signInBtn = await page.$('#signInBtn');
        console.log(`🔘 Sign In button found: ${signInBtn !== null}`);
        
        if (signInBtn) {
            console.log('🖱️ Clicking Sign In button...');
            await signInBtn.click();
            
            // Wait to see what happens
            await page.waitForTimeout(3000);
            
            // Check current URL
            const currentUrl = page.url();
            console.log(`🌍 Current URL: ${currentUrl}`);
        }
        
        // Keep browser open for manual inspection
        console.log('🔍 Browser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        await browser.close();
        console.log('✅ Browser closed');
    }
}

debugConsole();