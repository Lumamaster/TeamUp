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

// TODO: GENERATE USER ID

public class blockUserSel {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:3000/profile/";
    WebDriverWait wait = new WebDriverWait(driver, 10);
    WebStorage webStorage = (WebStorage) driver;
    LocalStorage localStorage = webStorage.getLocalStorage();

    @Test
    public void successBlock() {

        driver.get(createUserUrl);
        WebElement blockButton = driver.findElement(By.name("blockbutton"));

        blockButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        boolean exists = responseMessage.contains("successfully added to lists");
        Assertions.assertTrue(exists);
    }

    @Test
    public void successUnblock() {

        driver.get(createUserUrl);
        WebElement blockButton = driver.findElement(By.name("blockbutton"));

        blockButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        boolean exists = responseMessage.contains("unblocked successfully");
        Assertions.assertTrue(exists);
    }
}
