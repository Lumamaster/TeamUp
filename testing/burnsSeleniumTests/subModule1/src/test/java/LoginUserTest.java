import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class LoginUserTest {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:300";
    final String email = "DONOTDELETE@purdue.edu";
    final String password = "V4lidPassword$";
    WebDriverWait wait = new WebDriverWait(driver, 10);

    @Test
    public void testSuccessfulLogin() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys(email);
        passEl.sendKeys(password);
        loginButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("loginResponse")));
        String responseMessage = messElement.getAttribute("message");
        String successmsg = "logged in successfully";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testFailedLoginEmail() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("defnoreal@purdue.edu");
        passEl.sendKeys(password);
        loginButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("loginResponse")));
        String responseMessage = messElement.getAttribute("err");
        String successmsg = "incorrect email or password";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testFailedLoginPassword() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys(email);
        passEl.sendKeys("thisiswrongpassword");
        loginButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("loginResponse")));
        String responseMessage = messElement.getAttribute("err");
        String successmsg = "incorrect email or password";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testEmptyEmail() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("");
        passEl.sendKeys(password);
        loginButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("loginResponse")));
        String responseMessage = messElement.getAttribute("err");
        String successmsg = "incorrect email or password";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testEmptyPassword() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("DONOTDELETE@purdue.edu");
        passEl.sendKeys("");
        loginButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("loginResponse")));
        String responseMessage = messElement.getAttribute("err");
        String successmsg = "incorrect email or password";
        Assert.assertEquals(successmsg, responseMessage);
    }
}
