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

// TODO: GET ID FROM TOKEN

public class editProfileSel {
    WebDriver driver = new ChromeDriver();
    final String createUserUrl = "http://localhost:3000/profile/";
    WebDriverWait wait = new WebDriverWait(driver, 10);
    WebStorage webStorage = (WebStorage) driver;
    LocalStorage localStorage = webStorage.getLocalStorage();

    @Test
    public void successAddSkill() {
        driver.get(createUserUrl);
        WebElement addSkillButton = driver.findElement(By.id("add-skill-button"));
        addSkillButton.click();

        double rand = Math.random() * (500000);
        rand = rand/1;
        int randInt = (int) rand;
        String randString = Integer.toString(randInt);

        WebElement skillText = driver.findElement(By.id("add-skill-text"));
        skillText.sendKeys("Writing selenium Tests" + randString);

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        boolean exists = responseMessage.contains("Skill added successfully");
        Assertions.assertTrue(exists);
    }

    @Test
    public void successRemoveSkill() {
        driver.get(createUserUrl);
        WebElement removeSkillButton = driver.findElement(By.id("remove-skill-button"));
        removeSkillButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        boolean exists = responseMessage.contains("Skill removed successfully");
        Assertions.assertTrue(exists);
    }

    @Test
    public void editOtherParts() {
        driver.get(createUserUrl);
        WebElement editProfButton = driver.findElement(By.name("editbutton"));
        editProfButton.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("createResponse")));
        String responseMessage = messElement.getText();
        boolean exists = responseMessage.contains("profile changed successfully");
        Assertions.assertTrue(exists);
    }
}
