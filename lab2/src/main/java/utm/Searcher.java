package utm;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Searcher {

    private static final Integer MAX_RESULTS = 10;
    private static final String GOOGLE_URL = "https://www.googleapis.com/customsearch/v1";
    private static final String API_KEY = "AIzaSyBKAkng_5Qu43Yg4aBlvEHKb-A2V6l2UBI";
    private static final String CX = "75e13f83e334443b6";

    public static void main(String[] args) {
        // first verify whether the Searcher is called correctly
        if (args.length < 1) {
            System.err.printf("Searcher expectations not met:%n" +
                    "Provide only the query%n");
            System.exit(2);
        }
        System.out.println(args[0]);

        try {
            String query = URLEncoder.encode(args[0], StandardCharsets.UTF_8);
            URI uri = URI.create(String.format("%s?key=%s&cx=%s&q=%s", GOOGLE_URL, API_KEY, CX, query));
            HttpURLConnection connection = (HttpURLConnection) uri.toURL().openConnection();

            connection.setRequestMethod("GET");
            int responseCode = connection.getResponseCode();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                String response = getResponseBodyAsString(connection);
                List<String> searchResults = getResults(response);
                System.out.println("'" + args[0] + "' provided the following results:");
                for (int i = 0; i < searchResults.size(); i++) {
                    String result = searchResults.get(i);
                    System.out.println((i+1) + ". " + result);
                }
            } else {
                System.err.println("Failed to get search results. Response code: " + responseCode);
            }
            connection.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static List<String> getResults(String responseString) {
        JSONObject json = new JSONObject(responseString);
        JSONArray items = json.getJSONArray("items");

        return IntStream.range(0, Math.min(items.length(), MAX_RESULTS))
                .mapToObj(items::getJSONObject)
                .map(item -> item.getString("title") + " - " + item.getString("link"))
                .collect(Collectors.toList());
    }

    private static String getResponseBodyAsString(HttpURLConnection connection) throws IOException {
        try (Scanner scanner = new Scanner(connection.getInputStream(), StandardCharsets.UTF_8).useDelimiter("\\A")) {
            return scanner.hasNext() ? scanner.next() : "";
        }
    }
}
