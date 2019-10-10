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

public class UserReviewTest {

    @Test
    public void testReviewSuccess() {
        try {
            URL url = new URL("http://localhost:8000/leavereview/5d9bab9182e25440bcdd3236");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"review\":\"this is my test review\"}".getBytes(StandardCharsets.UTF_8);
            int length = out.length;

            http.setFixedLengthStreamingMode(length);
            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer " + Constants.BEARER_TOKEN);
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
                    System.out.println(lastString);
                }
            }
            in.close();

            boolean exists = lastString.contains("review added");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testReviewInvalidId() {
        try {
            URL url = new URL("http://localhost:8000/leavereview/fdsaaaaa");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            http.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            http.setRequestProperty("Authorization", "Bearer " + Constants.BEARER_TOKEN);
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

            Assertions.assertEquals(statuscode, 400);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

}
