import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.html5.LocalStorage;
import org.openqa.selenium.html5.WebStorage;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

public class FullTest {
    WebDriver driver = new ChromeDriver();
    String url = "http://localhost:3000/login";
    final String password = "Pa$$w0rd";
    WebStorage webStorage = null;
    LocalStorage localStorage = null;
    String randString = "";


    @Test
    public void userTesting() throws InterruptedException {

        driver.get(url);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("burns140@purdue.edu");
        passEl.sendKeys(password);

        loginButton.click();

        Thread.sleep(3000);

        webStorage = (WebStorage) driver;
        localStorage = webStorage.getLocalStorage();

        url = "http://localhost:3000/profile";
        driver.get(url);

        Thread.sleep(2000);

        WebElement editButton = driver.findElement(By.name("editbutton"));
        editButton.click();

        Thread.sleep(2000);

        double rand = Math.random() * (500000);
        rand = rand / 1;
        int randInt = (int) rand;
        randString = Integer.toString(randInt);

        WebElement skillText = driver.findElement(By.id("add-skill-text"));
        skillText.sendKeys("Writing selenium Tests" + randString);
        WebElement addSkillButton = driver.findElement(By.id("add-skill-button"));
        addSkillButton.click();

        Thread.sleep(1000);

        editButton.click();

        driver.get(url);

        Thread.sleep(2000);

        editButton = driver.findElement(By.name("editbutton"));
        editButton.click();

        Thread.sleep(2000);

        WebElement removeSkillButton = driver.findElement(By.id("Writing selenium Tests" + randString));
        removeSkillButton.click();

        Thread.sleep(1000);

        editButton.click();

        Thread.sleep(1000);

        url = "http://localhost:3000/users";
        driver.get(url);

        WebElement searchTextbox = driver.findElement(By.name("searchText"));
        searchTextbox.sendKeys("amind");

        Thread.sleep(1500);

        WebElement clickID = driver.findElement(By.id("amind"));
        clickID.click();

        Thread.sleep(1500);

        WebElement blockButton = driver.findElement(By.name("blockbutton"));
        blockButton.click();

        Thread.sleep(1000);

        driver.switchTo().alert().accept();

        Thread.sleep(500);

        url = "http://localhost:3000/profile";
        driver.get(url);

        Thread.sleep(1000);

        //WebElement unblockbutton = driver.findElement(By.id("5dab5b9bfa7f4079fd24e0d3"));

    }
}