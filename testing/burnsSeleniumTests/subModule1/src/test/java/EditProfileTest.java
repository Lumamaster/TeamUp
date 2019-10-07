import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.TestMethodOrder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class EditProfileTest {

    @Test
    @Order(1)
    public void testAddSkill() {
        try {
            URL url = new URL("http://localhost:8000/user/profile/edit/addskill");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"burns140@purdue.edu\",\"skill\":\"dying\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNWQ4MDFmNGMxOWI0NGExMmEwMjNiZjJhIn0sImlhdCI6MTU2OTYwMDQ5OCwiZXhwIjoxNTY5Njg2ODk4fQ.3L7Fg7_Rj7kbIEGUTIKkU5Edt0SRnUNExr0hvPau314");
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

            boolean exists = lastString.contains("Skill added successfully");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    @Order(2)
    public void testRemoveSkill() {
        try {
            URL url = new URL("http://localhost:8000/user/profile/edit/removeskill");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"burns140@purdue.edu\",\"skill\":\"dying\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNWQ4MDFmNGMxOWI0NGExMmEwMjNiZjJhIn0sImlhdCI6MTU2OTYwMDQ5OCwiZXhwIjoxNTY5Njg2ODk4fQ.3L7Fg7_Rj7kbIEGUTIKkU5Edt0SRnUNExr0hvPau314");
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

            boolean exists = lastString.contains("Skill removed successfully");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testAddExistingSkill() {
        try {
            URL url = new URL("http://localhost:8000/user/profile/edit/addskill");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"burns140@purdue.edu\",\"skill\":\"i have no skills\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiNWQ4MDFmNGMxOWI0NGExMmEwMjNiZjJhIn0sImlhdCI6MTU2OTYwMDQ5OCwiZXhwIjoxNTY5Njg2ODk4fQ.3L7Fg7_Rj7kbIEGUTIKkU5Edt0SRnUNExr0hvPau314");
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

            boolean exists = lastString.contains("Skill already in your profile");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testRemoveNonexistingSkill() {
        try {
            URL url = new URL("http://localhost:8000/user/profile/edit/removeskill");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"email\":\"burns140@purdue.edu\",\"skill\":\"fakeskill\"}".getBytes(StandardCharsets.UTF_8);
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

            boolean exists = lastString.contains("Skill not on your profile");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }
}
