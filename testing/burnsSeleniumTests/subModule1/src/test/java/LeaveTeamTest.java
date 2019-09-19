import com.gargoylesoftware.htmlunit.javascript.host.idb.IDBCursor;
import com.mongodb.*;
import com.mongodb.client.*;


import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.model.CreateCollectionOptions;
import com.mongodb.client.model.ValidationOptions;
import org.bson.Document;
//import com.mongodb.MongoClientOptions;
import org.junit.Assert;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.json.Json;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.print.Doc;
import java.util.List;

public class LeaveTeamTest {
    //WebDriver driver = new ChromeDriver();
    final String userProfileUrl = "http://localhost:3000";
    final String email = "DONOTDELETE@purdue.edu";
    final String password = "V4lidPassword$";
    String teamname = "teamname";
    //WebDriverWait wait = new WebDriverWait(driver, 10);
    MongoClient mongoClient = MongoClients.create("mongodb+srv://sburns:cheebs13@cluster0-wwsap.mongodb.net/test?retryWrites=true&w=majority");
    MongoCollection<Document> userCollection = mongoClient.getDatabase("Users").getCollection("user");
    MongoCollection<Document> teamCollection = mongoClient.getDatabase("Teams").getCollection("team");

    @Test
    public void testLeaveTeamSuccess() {
        /*driver.get(userProfileUrl);
        WebElement teamEl = driver.findElement(By.name("teamname"));
        teamEl.click();

        WebElement messElement = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("loginResponse")));
        String responseMessage = messElement.getAttribute("err");
        String successmsg = "incorrect email or password";
        Assert.assertEquals(successmsg, responseMessage);
*/
        MongoCursor<Document> cursor = teamCollection.find(eq("teamName", teamname)).iterator();

        try {
            while (cursor.hasNext()) {
                System.out.println(cursor.next().toJson());
                String ans = cursor.next().getString("teamname");
            }
        } finally {
            cursor.close();
        }
    }

    Block<Document> findTeam = new Block<Document>() {
        public void apply(final Document document) {
            System.out.println(document.toJson());
        }
    };




}
