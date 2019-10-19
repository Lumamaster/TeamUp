import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.html5.LocalStorage;
import org.openqa.selenium.html5.WebStorage;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.util.Properties;
import java.util.concurrent.TimeUnit;

public class loginUserSel {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:3000/login";
    final String password = "Pa$$w0rd";


    @Test
    public void successLogin() {

        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("burns140@purdue.edu");
        passEl.sendKeys(password);

        loginButton.click();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        driver.manage().timeouts().implicitlyWait(5, TimeUnit.SECONDS) ;
        WebStorage webStorage = (WebStorage) driver;
        LocalStorage localStorage = webStorage.getLocalStorage();

        Properties pro = new Properties();
        for (String key : localStorage.keySet()) {
            pro.setProperty(key, localStorage.getItem(key));
            System.out.println(localStorage.getItem(key));
        }


    }

    @Test
    public void passFailLogin() {
        WebDriver driver = new ChromeDriver();
        final String createUserUrl = "http://localhost:3000/login";
        final String password = "incorrectpassword";

        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("burns140@purdue.edu");
        passEl.sendKeys(password);

        createButton.click();


    }
}
