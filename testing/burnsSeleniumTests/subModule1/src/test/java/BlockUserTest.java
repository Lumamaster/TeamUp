

import org.junit.jupiter.api.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class BlockUserTest {


    @Test
    @Order(1)
    public void testBlockUserSuccess() {

        try {
            URL url = new URL("http://localhost:8000/blk/block/5d9b85a482e25440bcdd3235");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET"); // PUT is another valid option
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
                    System.out.println(lastString);
                }
                System.out.println(decodedString);
            }
            in.close();

            boolean exists = lastString.contains("successfully added to lists");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }

    }

    @Test
    public void testBlockInvalidId() {
        try {
            URL url = new URL("http://localhost:8000/blk/block/fdsalkjeid");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET"); // PUT is another valid option
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
                    System.out.println(lastString);
                }
                System.out.println(decodedString);
            }
            in.close();

            Assertions.assertEquals(400, statuscode);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    @Order(2)
    public void testBlockAlreadyBlocked() {
        try {
            URL url = new URL("http://localhost:8000/blk/block/5d9b85a482e25440bcdd3235");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET"); // PUT is another valid option
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
                    System.out.println(lastString);
                }
                System.out.println(decodedString);
            }
            in.close();

            Assertions.assertEquals(statuscode, 200);
        } catch (IOException e) {
            System.out.println(e);
        }
    }

    @Test
    @Order(3)
    public void testUnblockUserSuccess() {
        try {
            URL url = new URL("http://localhost:8000/blk/unblock/5d9b85a482e25440bcdd3235");
            URLConnection con = url.openConnection();
            HttpURLConnection http = (HttpURLConnection)con;
            http.setRequestMethod("GET"); // PUT is another valid option
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

            boolean exists = lastString.contains("unblocked successfully");
            Assertions.assertTrue(exists);
        } catch (IOException e) {
            System.out.println(e);
        }
    }
}
