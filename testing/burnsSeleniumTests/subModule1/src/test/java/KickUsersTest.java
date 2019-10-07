import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

public class KickUsersTest {

    @Test
    public void testKickUserSuccess() {
        try {
            URL url = new URL("http://localhost:8000/kickuser/5d84569de4ff8a0ce88b3720");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"kick\":\"5d801f4c19b44a12a023bf2a\"}".getBytes(StandardCharsets.UTF_8);
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

            boolean exists = lastString.contains("successfully changed cur and prev teams");
            Assertions.assertTrue(exists);
            Assertions.assertEquals(200, statuscode);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testUserNotInTeam() {
        try {
            URL url = new URL("http://localhost:8000/kickuser/5d84569de4ff8a0ce88b3720");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"kick\":\"notinteamnotinteamnotint\"}".getBytes(StandardCharsets.UTF_8);
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

            boolean exists = lastString.contains("user with that id not in that team");
            Assertions.assertTrue(exists);
            Assertions.assertEquals(statuscode, 400);
        } catch (IOException e) {
            System.out.println(e);
        }
    }
}
