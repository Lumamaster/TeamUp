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

public class createUserSel {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:3000/signup";
    final String password = "V4lidPassword$";
    WebStorage webStorage = (WebStorage) driver;
    LocalStorage localStorage = webStorage.getLocalStorage();

    @Test
    public void successCreate() {
        driver.get(createUserUrl);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement pass2El = driver.findElement(By.name("password2"));
        WebElement nameEl = driver.findElement(By.name("screenname"));
        WebElement createButton = driver.findElement(By.name("createbutton"));

        double rand = Math.random() * (500000);
        rand = rand/1;
        int randInt = (int) rand;
        String randString = Integer.toString(randInt);



        emailEl.sendKeys(randString + "@purdue.edu");
        passEl.sendKeys(password);
        pass2El.sendKeys(password);
        nameEl.sendKeys(randString);

        createButton.click();

    }
}
