import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

public class SeeAllSkillsTest {

    @Test
    public void testAllSkillsSuccess() {
        try {
            URL url = new URL("http://localhost:8000/teamskills/5d8e868816243b778894c248");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET");
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

            boolean exists = lastString.contains("skill array returned");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    public void testAllSkillsFailure() {
        try {
            URL url = new URL("http://localhost:8000/teamskills/asdffafaere");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET");
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

            Assertions.assertEquals(400, statuscode);
        } catch (IOException e) {
            System.out.println(e);
        }
    }
}
