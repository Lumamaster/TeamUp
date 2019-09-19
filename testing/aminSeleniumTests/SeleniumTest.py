#Import the webdriver for testing the webapp on browser
from selenium import webdriver
#Import Keys to send keyboard input
from selenium.webdriver.common.keys import Keys

#Select the browser as Chrome
browser = webdriver.Chrome()

#Open the homepage on browser
browser.get('url goes here')

#Select the email element on the webpage
elem_email = browser.find_element_by_css_selector('root > div.container > form > input[type=text]:nth-child(1)')

#Enter a purdue email
elem_email.clear()
elem_email.send_keys("test@purdue.edu")

#Select the password element on the webpage
elem_pass = browser.find_element_by_css_selector('root > div.container > form > input[type=password]:nth-child(3)')

#Enter a valid password
elem_pass.clear()
elem_pass.send_keys("HelloWorld123")

#Login/Submit form
elem_login = browser.find_element_by_css_selector('root > div.container > form > button')

