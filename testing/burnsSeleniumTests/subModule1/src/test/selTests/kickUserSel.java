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

public class kickUserSel {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:3000/teams/";
    final String password = "Pa$$w0rd";
    WebDriverWait wait = new WebDriverWait(driver, 10);
    WebStorage webStorage = (WebStorage) driver;
    LocalStorage localStorage = webStorage.getLocalStorage();

    // TODO:


    @Test
    public void successKick() {

        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement createButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("burns140@purdue.edu");
        passEl.sendKeys(password);

        createButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        boolean exists = responseMessage.contains("successfully logged in");
        Assertions.assertTrue(exists);
    }
}

