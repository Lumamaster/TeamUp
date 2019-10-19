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

public class FullTest {
    WebDriver driver = new ChromeDriver();
    String url = "http://localhost:3000/login";
    final String password = "Pa$$w0rd";
    WebStorage webStorage = null;
    LocalStorage localStorage = null;
    String randString = "";



    @Test
    @Order(1)
    public void successLogin() {

        driver.get(url);
        WebElement emailEl = driver.findElement(By.name("email"));
        WebElement passEl = driver.findElement(By.name("password"));
        WebElement loginButton = driver.findElement(By.name("loginbutton"));

        emailEl.sendKeys("burns140@purdue.edu");
        passEl.sendKeys(password);

        loginButton.click();

        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        webStorage = (WebStorage) driver;
        localStorage = webStorage.getLocalStorage();

        url = "http://localhost:3000/profile";
        driver.get(url);

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement editButton = driver.findElement(By.name("editbutton"));
        editButton.click();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        double rand = Math.random() * (500000);
        rand = rand/1;
        int randInt = (int) rand;
        randString = Integer.toString(randInt);

        WebElement skillText = driver.findElement(By.id("add-skill-text"));
        skillText.sendKeys("Writing selenium Tests" + randString);
        WebElement addSkillButton = driver.findElement(By.id("add-skill-button"));
        addSkillButton.click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        editButton.click();

        driver.get(url);

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        editButton = driver.findElement(By.name("editbutton"));
        editButton.click();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement removeSkillButton = driver.findElement(By.id("Writing selenium Tests" + randString));
        removeSkillButton.click();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        editButton.click();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        url = "http://localhost:3000/users";
        driver.get(url);

        WebElement searchTextbox = driver.findElement(By.name("searchText"));
        searchTextbox.sendKeys("amind");

        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement clickID = driver.findElement(By.id("amind"));
        clickID.click();

    }

    @Test
    @Order(2)
    public void successAddSkill() {
        url = "http://localhost:3000/profile";
        driver.get(url);

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement editButton = driver.findElement(By.name("editbutton"));
        editButton.click();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        double rand = Math.random() * (500000);
        rand = rand/1;
        int randInt = (int) rand;
        randString = Integer.toString(randInt);

        WebElement skillText = driver.findElement(By.id("add-skill-text"));
        skillText.sendKeys("Writing selenium Tests" + randString);
        WebElement addSkillButton = driver.findElement(By.id("add-skill-button"));
        addSkillButton.click();
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        editButton.click();



    }

    @Test
    @Order(3)
    public void successRemoveSkill() {
        driver.get(url);

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement editButton = driver.findElement(By.name("editbutton"));
        editButton.click();

        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        WebElement removeSkillButton = driver.findElement(By.id("Writing selenium Tests" + randString));
        removeSkillButton.click();

        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        editButton.click();
    }
}
