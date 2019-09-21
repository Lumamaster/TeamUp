const puppeteer = require('puppeteer')

let browser;

testLogin = async () => {
    browser = await puppeteer.launch({headless:true});  //set headless to false to see what's going on
    await testNormalLogin();
    await testBlankEmail();
    await testBlankPassword();
    await testInvalidEmail();
    await testInvalidPassword();
    await testResponseErrorDisplay();
    await browser.close();
}

testNormalLogin = async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login')

    await page.click('#email')
    await page.keyboard.type('DONOTDELETE@purdue.edu')
    await page.click('#password')
    await page.keyboard.type('V4lidPassword$')
    
    try{

        const req = (await Promise.all([page.waitForRequest('http://localhost:3000/login', {timeout:10000}), page.click('#login')]))[0]
        //console.log(req)
        if(JSON.parse(req._postData).email === 'DONOTDELETE@purdue.edu' && JSON.parse(req._postData).password === 'V4lidPassword$') {
            console.log('Normal Login \x1b[32m%s\x1b[0m', 'PASSED')
            return true;
        } else {
            console.log('Normal Login \x1b[31m%s\x1b[0m', 'FAILED')
            return false;
        }
    } catch(err) {
        console.error(err)
        console.log('Normal Login \x1b[31m%s\x1b[0m', 'FAILED')
        return false;
    }
}

testBlankEmail = async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login')
    await page.setRequestInterception(true)
    page.on('request', req => {
        if(req.url() === 'http://localhost:3000/login') {
            console.log('Blank Email \x1b[31m%s\x1b[0m', 'FAILED')
            return false;
        }
    })

    await page.click('#password')
    await page.keyboard.type('V4lidPassword$')
    await page.click('#login')
    const err = await page.waitFor('.color-error', {timeout:1000})
    await page.close();
    if(err) {
        console.log('Blank Email \x1b[32m%s\x1b[0m', 'PASSED')
        return true;
    }
    console.log('Blank Email \x1b[31m%s\x1b[0m', 'FAILED')
    return false;
}

testBlankPassword = async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login')
    await page.setRequestInterception(true)
    page.on('request', req => {
        if(req.url() === 'http://localhost:3000/login') {
            console.log('Blank Password \x1b[31m%s\x1b[0m', 'FAILED')
            return false;
        }
    })

    await page.click('#email')
    await page.keyboard.type('DONOTDELETE@purdue.edu')
    await page.click('#login')
    const err = await page.waitFor('.color-error', {timeout:1000})
    await page.close();
    if(err) {
        console.log('Blank Password \x1b[32m%s\x1b[0m', 'PASSED')
        return true;
    }
    console.log('Blank Password \x1b[31m%s\x1b[0m', 'FAILED')
    return false;
}

testInvalidPassword = async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login')
    await page.setRequestInterception(true)
    page.on('request', req => {
        if(req.url() === 'http://localhost:3000/login') {
            console.log('Invalid Password \x1b[31m%s\x1b[0m', 'FAILED')
            return false;
        }
    })

    await page.click('#email')
    await page.keyboard.type('DONOTDELETE@purdue.edu')
    await page.click('#password')
    await page.keyboard.type('invalid')
    await page.click('#login')
    const err = await page.waitFor('.color-error', {timeout:1000})
    await page.close();
    if(err) {
        console.log('Invalid Password \x1b[32m%s\x1b[0m', 'PASSED')
        return true;
    }
    console.log('Invalid Password \x1b[31m%s\x1b[0m', 'FAILED')
    return false;
}

testInvalidEmail = async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login')
    await page.setRequestInterception(true)
    page.on('request', req => {
        if(req.url() === 'http://localhost:3000/login') {
            console.log('Invalid Email \x1b[31m%s\x1b[0m', 'FAILED')
            return false;
        }
    })

    await page.click('#email')
    await page.keyboard.type('thisisnotanemail')
    await page.click('#email')
    await page.keyboard.type('invalid')
    await page.click('#login')
    const err = await page.waitFor('.color-error', {timeout:1000})
    await page.close();
    if(err) {
        console.log('Invalid Email \x1b[32m%s\x1b[0m', 'PASSED')
        return true;
    }
    console.log('Invalid Email \x1b[31m%s\x1b[0m', 'FAILED')
    return false;
}

testResponseErrorDisplay = async () => {
    let sentRequest = false;

    const page = await browser.newPage();
    await page.goto('http://localhost:3000/login')
    await page.setRequestInterception(true);
    await page.click('#email')
    await page.keyboard.type('DONOTDELETE@purdue.edu')
    await page.click('#password')
    await page.keyboard.type('V4lidPassword$')
    
    try{
        const req = (await Promise.all([page.waitForRequest('http://localhost:3000/login', {timeout:10000}), page.click('#login')]))[0]
        //console.log(req)
        if(JSON.parse(req._postData).email === 'DONOTDELETE@purdue.edu' && JSON.parse(req._postData).password === 'V4lidPassword$') {
            req.respond({
                status:400,
                body:JSON.stringify({
                    err:"Something went wrong"
                })
            })
            const err = await page.waitFor('.color-error', {timeout:1000})
            await page.close();
            if(err) {
                console.log('Show Response Error \x1b[32m%s\x1b[0m', 'PASSED')
                return true;
            }
            console.log('Show Response Error \x1b[31m%s\x1b[0m', 'FAILED')
            return false;
        } else {
            console.log('Show Response Error \x1b[31m%s\x1b[0m', 'FAILED')
            await page.close();
            return false;
        }
    } catch(err) {
        console.error(err)
        await page.close();
        console.log('Show Response Error \x1b[31m%s\x1b[0m', 'FAILED')
        return false;
    }
}

module.exports = testLogin;
//testLogin();