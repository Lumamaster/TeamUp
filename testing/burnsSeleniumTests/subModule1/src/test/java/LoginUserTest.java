import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

public class LoginUserTest {
    //WebDriver driver = new ChromeDriver();
    final String loginUserUrl = "http://localhost:3000";
    final String email = "DONOTDELETE@purdue.edu";
    final String password = "V4lidPassword$";
    //WebDriverWait wait = new WebDriverWait(driver, 10);

    @Test
    public void testSuccessfulLogin() {
        try {
            URL url = new URL("http://localhost:8000/login");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"burns140@purdue.edu\",\"password\":\"V4lidPa$$word\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.connect();
            try(OutputStream os = http.getOutputStream()) {
                os.write(out);
            }

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

            boolean exists = lastString.contains("successfully logged in");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testFailedLoginEmail() {
        try {
            URL url = new URL("http://localhost:8000/login");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"dontexist@purdue.edu\",\"password\":\"V4lidPa$$word\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.connect();
            try(OutputStream os = http.getOutputStream()) {
                os.write(out);
            }

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

            boolean exists = lastString.contains("Incorrect username or password");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testFailedLoginPassword() {
        try {
            URL url = new URL("http://localhost:8000/login");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"burns140@purdue.edu\",\"password\":\"incorrectPassword\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.connect();
            try(OutputStream os = http.getOutputStream()) {
                os.write(out);
            }

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

            boolean exists = lastString.contains("Incorrect username or password");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testEmptyEmail() {
        try {
            URL url = new URL("http://localhost:8000/login");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"\",\"password\":\"V4lidPa$$word\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.connect();
            try(OutputStream os = http.getOutputStream()) {
                os.write(out);
            }

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

            boolean exists = lastString.contains("missing email or password");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testEmptyPassword() {
        try {
            URL url = new URL("http://localhost:8000/login");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"burns140@purdue.edu\",\"password\":\"\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.connect();
            try(OutputStream os = http.getOutputStream()) {
                os.write(out);
            }

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

            boolean exists = lastString.contains("missing email or password");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }
}
