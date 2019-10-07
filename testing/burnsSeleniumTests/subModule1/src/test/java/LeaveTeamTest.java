import com.gargoylesoftware.htmlunit.javascript.host.idb.IDBCursor;
import com.mongodb.*;
import com.mongodb.client.*;


import static com.mongodb.client.model.Filters.*;
import com.mongodb.client.model.CreateCollectionOptions;
import com.mongodb.client.model.ValidationOptions;
import org.bson.Document;
//import com.mongodb.MongoClientOptions;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.json.Json;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import javax.print.Doc;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class LeaveTeamTest {
    //WebDriver driver = new ChromeDriver();
    final String userProfileUrl = "http://localhost:3000";
    final String email = "DONOTDELETE@purdue.edu";
    final String password = "V4lidPassword$";
    String teamname = "teamname";
    //WebDriverWait wait = new WebDriverWait(driver, 10);

    @Test
    public void testLeaveTeamSuccess() {
        try {
            URL url = new URL("http://localhost:8000/teams/leave/5d840c25607f6e2e3ce30923");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNWQ4MDFmNGMxOWI0NGExMmEwMjNiZjJhIn0sImlhdCI6MTU2OTYwMDQ5OCwiZXhwIjoxNTY5Njg2ODk4fQ.3L7Fg7_Rj7kbIEGUTIKkU5Edt0SRnUNExr0hvPau314");
            http.connect();

            BufferedReader in;
            int statuscode = ((HttpURLConnection) con).getResponseCode();
            if (statuscode >= 400) {
                in = new BufferedReader(new InputStreamReader(((HttpURLConnection) con).getErrorStream()));
            } else {
                in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            }
            String decodedString;
            String lastString = "";
            while ((decodedString = in.readLine()) != null) {
                if (decodedString != null) {
                    lastString = decodedString;
                }
                System.out.println(decodedString);
            }
            in.close();

            boolean exists = lastString.contains("successfully removed from team");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }

    }

    @Test
    public void testLeaveFailNoExist() {
        try {
            URL url = new URL("http://localhost:8000/teams/leave/fkukodfreuti");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET"); // PUT is another valid option
            http.setDoOutput(true);

            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNWQ4MDFmNGMxOWI0NGExMmEwMjNiZjJhIn0sImlhdCI6MTU2OTYwMDQ5OCwiZXhwIjoxNTY5Njg2ODk4fQ.3L7Fg7_Rj7kbIEGUTIKkU5Edt0SRnUNExr0hvPau314");

            http.connect();

            BufferedReader in;
            int statuscode = ((HttpURLConnection) con).getResponseCode();
            if (statuscode >= 400) {
                in = new BufferedReader(new InputStreamReader(((HttpURLConnection) con).getErrorStream()));
            } else {
                in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            }
            String decodedString;
            String lastString = "";
            while ((decodedString = in.readLine()) != null) {
                if (decodedString != null) {
                    lastString = decodedString;
                }
                System.out.println(decodedString);
            }
            in.close();

            boolean exists = lastString.contains("no team with that name exists");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testLeaveFailNotMember() {
        try {
            URL url = new URL("http://localhost:8000/teams/leave/5d840c25607f6e2e3ce30923");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET"); // PUT is another valid option
            http.setDoOutput(true);

            //byte[] out = "{\"email\":\"burns140@purdue.edu\",\"teamID\":\"5d840c25607f6e2e3ce30923\"}".getBytes(StandardCharsets.UTF_8);
            //int length = out.length;

            //http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNWQ4MDFmNGMxOWI0NGExMmEwMjNiZjJhIn0sImlhdCI6MTU2OTYwMDQ5OCwiZXhwIjoxNTY5Njg2ODk4fQ.3L7Fg7_Rj7kbIEGUTIKkU5Edt0SRnUNExr0hvPau314");
            http.connect();
            /*try(OutputStream os = http.getOutputStream()) {
                os.write(out);
            }*/

            BufferedReader in;
            int statuscode = ((HttpURLConnection) con).getResponseCode();
            if (statuscode >= 400) {
                in = new BufferedReader(new InputStreamReader(((HttpURLConnection) con).getErrorStream()));
            } else {
                in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            }
            String decodedString;
            String lastString = "";
            while ((decodedString = in.readLine()) != null) {
                if (decodedString != null) {
                    lastString = decodedString;
                }
                System.out.println(decodedString);
            }
            in.close();

            boolean exists = lastString.contains("You are not part of that team");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }




}
