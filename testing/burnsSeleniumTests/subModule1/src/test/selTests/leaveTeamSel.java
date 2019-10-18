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

public class leaveTeamSel {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:3000/teams/";
    WebDriverWait wait = new WebDriverWait(driver, 10);
    WebStorage webStorage = (WebStorage) driver;
    LocalStorage localStorage = webStorage.getLocalStorage();

    @Test
    public void successLeaveTeam() {
        driver.get(createUserUrl);
        WebElement leavebutton = driver.findElement(By.name("join-leave-button"));
        leavebutton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        boolean exists = responseMessage.contains("successfully removed from team");
        Assertions.assertTrue(exists);
    }
}
