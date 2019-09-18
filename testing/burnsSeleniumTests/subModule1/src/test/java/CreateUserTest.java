import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;


public class CreateUserTest {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:300";
    final String email = "burns140@purdue.edu";
    final String password = "V4lidPa44word";
    WebDriverWait wait = new WebDriverWait(driver, 10);

    @Test
    public void testSuccessCreateUser() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("createbutton"));

        emailEl.sendKeys(email);
        passEl.sendKeys(password);
        createButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        String successmsg = "User successfully created";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testInvalidEmail() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("createbutton"));

        emailEl.sendKeys("invalidemailtho");
        passEl.sendKeys(password);
        createButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        String successmsg = "Invalid email";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testInvalidPassword() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("createbutton"));

        emailEl.sendKeys("doesnexist@purdue.edu");
        passEl.sendKeys("invalidpassword");
        createButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        String successmsg = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testLongPassword() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("createbutton"));

        emailEl.sendKeys("doesnexist@purdue.edu");
        passEl.sendKeys("invalidpasswordflklhlkdflkjijidkjslkajfdjlfjadjlkjdfoih");
        createButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        String successmsg = "password must be between 8 and 20 characters";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testShortPassword() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("createbutton"));

        emailEl.sendKeys("doesnexist@purdue.edu");
        passEl.sendKeys("fds");
        createButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        String successmsg = "password must be between 8 and 20 characters";
        Assert.assertEquals(successmsg, responseMessage);
    }

    @Test
    public void testUserAlreadyExists() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("createbutton"));

        emailEl.sendKeys("DONOTDELETE@purdue.edu");
        passEl.sendKeys("V4lidPassword$");
        createButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getAttribute("err");
        String successmsg = "User with that email already exists";
        Assert.assertEquals(successmsg, responseMessage);
    }
}
