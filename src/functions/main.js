const { EventEmitter } = require('events')
const fs = require('fs');

const {main_page, login_page, billing_page, profile_page, boost_page} = require('./paths/paths');


class GameTracker extends EventEmitter{

    constructor(url, username, password, debug = true){
        super();
        this.puppeteer = require('puppeteer');;
        this.creds = {
            username,
            password
        }

        this.state = {
            valid: false,
            logged: false,
            cookies: []
        }

        this.headless = debug

        // Check data
        this.checkUrl(url);
    }

    checkUrl(url){
        if(!url){
            console.log('Url not defined, set url first');
            process.exit(1)
        }  
    }

    
    login(){
        return new Promise((resolve, reject) =>{
            try {
                if(!fs.existsSync('./cookies.json')) {
                    (async () =>{
                        const browser = await this.puppeteer.launch({headless: !this.headless});
                        const page = await browser.newPage();
                        await page.goto(login_page, { waitUntil: 'networkidle0' }); // wait until page load
                        await page.type('#login-username', this.creds.username);
                        await page.type('#login-password', this.creds.password);
                        // click and wait for navigation
                        await Promise.all([
                            page.click('.controls button'),
                            page.waitForNavigation({ waitUntil: 'networkidle0' }),
                        ]);
                        const cookies = await page.cookies();
                        await browser.close();
                        fs.writeFile(
                            'cookies.json',
                            JSON.stringify(cookies)
                        , (err) => {
                            reject(err)
                        });
                        resolve(cookies)                 
                    })()
                }else{
                    try {
                        fs.readFile('cookies.json', 'utf8',  (err, data) =>{
                            if (err) reject(err);
                            resolve(JSON.parse(data));
                        });
                    } catch (error) {
                        reject(error)
                    }
                } 
            } catch(err) {
                reject(err)
            }

            
        });
    }

    getGtcCoinsStatus(cookies){
        return new Promise((resolve, reject) =>{
            try {
                (async () =>{
                    const browser = await this.puppeteer.launch({headless: !this.headless});
                    const page = await browser.newPage();
                    await page.setCookie(...cookies);
                    await page.goto(billing_page, { waitUntil: 'networkidle0' }); // wait until page load
                    const coins = await page.evaluate(() =>{
                        const gtcString = $('.game-content .server-details li dl :first').text();
                        return gtcString.match(/Your balance: (.*) GTC/)[1]
                    })
                    await browser.close();
                    resolve(coins)                 
                })()

            } catch (error) {
                console.log('error: ', error)
                reject(error)
            }
                
        });
    }

    getTopWorld(){
        return new Promise((resolve, reject) =>{
            try {
                (async () =>{
                    const browser = await this.puppeteer.launch({headless: !this.headless});
                    const page = await browser.newPage();
                    await page.goto(main_page, { waitUntil: 'networkidle0' }); // wait until page load
                    const world = await page.evaluate(() =>{
                        const servers = [];
                        $("#gt-perks div:nth-child(1) ul li").each(function() {
                            var rank = $(this).find('small').text().trim();
                            var name = $(this).find('h3 a').text().trim();
                            var link = $(this).find('h3 a').attr('href');    
                            const serverObject = {
                                rank,
                                name,
                                link
                            }
                            servers.push(serverObject);
                        })
                        return servers
                    })
                    await browser.close();
                    resolve(world)                 
                })()

            } catch (error) {
                console.log('error: ', error)
                reject(error)
            }       
        });
    }

    getTopBalkan(){
        return new Promise((resolve, reject) =>{
            try {
                (async () =>{
                    const browser = await this.puppeteer.launch({headless: !this.headless});
                    const page = await browser.newPage();
                    await page.goto(main_page, { waitUntil: 'networkidle0' }); // wait until page load
                    const balkan = await page.evaluate(() =>{
                        const servers = [];
                        $("#gt-perks div:nth-child(2) ul li").each(function() {
                            var rank = $(this).find('small').text().trim();
                            var name = $(this).find('h3 a').text().trim();
                            var link = $(this).find('h3 a').attr('href');    
                            const serverObject = {
                                rank,
                                name,
                                link
                            }
                            servers.push(serverObject);
                        })
                        return servers
                    })
                    await browser.close();
                    resolve(balkan)                 
                })()

            } catch (error) {
                console.log('error: ', error)
                reject(error)
            }       
        
        
        });
    }

    getJustAdded(){
        return new Promise((resolve, reject) =>{
            try {
                (async () =>{
                    const browser = await this.puppeteer.launch({headless: !this.headless});
                    const page = await browser.newPage();
                    await page.goto(main_page, { waitUntil: 'networkidle0' }); // wait until page load
                    const newServers = await page.evaluate(() =>{
                        const servers = [];
                        $("#gt-perks div:nth-child(3) ul li").each(function() {
                            var rank = $(this).find('small').text().trim();
                            var name = $(this).find('h3 a').text().trim();
                            var link = $(this).find('h3 a').attr('href');    
                            const serverObject = {
                                rank,
                                name,
                                link
                            }
                            servers.push(serverObject);
                        })
                        return servers
                    })
                    await browser.close();
                    resolve(newServers)                 
                })()

            } catch (error) {
                console.log('error: ', error)
                reject(error)
            }       
        });
    }


    postStatus(cookies, message){
        return new Promise((resolve, reject) =>{
            try {
                (async () =>{
                    const browser = await this.puppeteer.launch({headless: !this.headless});
                    const page = await browser.newPage();
                    await page.setCookie(...cookies);
                    await page.goto(profile_page, { waitUntil: 'networkidle0' }); // wait until page load
                    await page.click('#new-status textarea'),
                    await page.type('#new-status textarea', message);
                    await Promise.all([
                        page.click('#new-status input[type="submit"]'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' }),
                    ]);
                    const comment_id = await page.evaluate(() =>{
                        return $("ul.friend-activities .activity-controls a:first").attr('href')
                    })
                    await browser.close();
                    resolve(comment_id)                 
                })()

            } catch (error) {
                console.log('error: ', error)
                reject(error)
            }       
        });
    }

    boostServer(cookies, ip, nick){
        return new Promise((resolve, reject) =>{
            try {
                (async () =>{
                    const browser = await this.puppeteer.launch({headless: !this.headless});
                    const page = await browser.newPage();
                    await page.setCookie(...cookies);
                    await page.goto((boost_page + `/${ip}`), { waitUntil: 'networkidle0' }); // wait until page load
                    await page.waitFor('input[name="name"]');
                    await page.click('input[name="name"]', {clickCount: 3})
                    await page.type('input[name="name"]', nick);
                    await page.evaluate(()=>{
                        $('button').prop("disabled", false);
                    })
                    // click and wait for navigation
                    await Promise.all([
                        page.click('button'),
                        page.waitForNavigation({ waitUntil: 'networkidle0' }),
                        resolve(true) 
                    ]);
                    
                    await browser.close();
                          
                })()
            } catch(err) {
                reject(err)
            }

            
        });

    }


}


module.exports = {
    GameTracker
};