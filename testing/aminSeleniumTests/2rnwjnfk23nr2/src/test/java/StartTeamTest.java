import org.junit.Assert;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;

public class StartTeamTest {

    @Test
    public void testSuccessCreateUser() {

        try {
            URL url = new URL("http://localhost:8000/startteam");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("POST"); // PUT is another valid option
            http.setDoOutput(true);

            byte[] out = "{\"teamName\":\"Awesome Team\",\"TeamMembers\":\"delete@purdue.edu\", \"owner\":\"delete@purdue.edu\", \"info\":\"information\",\"requestedSkills\":\"Java\",\"numMembers\":\"1\", \"open\":\"true\", \"alive\":\"true\", \"course\": \"CS408\", \"maxMembers\":\"4\" }".getBytes(StandardCharsets.UTF_8);
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

            Assert.assertEquals(lastString, "Team created successfully");
        } catch (IOException e) {
            System.out.println(e);
        }


    }

}
