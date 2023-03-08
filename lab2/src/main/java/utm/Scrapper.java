package utm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.jsoup.Jsoup;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Scanner;

public class Scrapper {

    public static void main(String[] args) throws IOException {
        // first verify whether the Scrapper is called correctly
        if (args.length != 2) {
            System.err.printf("Scrapper expectations not met:%n" +
                    "1. The URL to scrape%n" +
                    "2. The directory path where the cache directory will be created%n");
            System.exit(2); // use 2 to indicate invalid arguments
        }

        String urlString = args[0];
        String cacheDirectoryPath = args[1];

        File cacheDirectory = Files.createDirectories(Paths.get(cacheDirectoryPath, "cache")).toFile();
        File cacheFile = new File(cacheDirectory, urlString.replaceAll("[^a-zA-Z0-9]", "") + ".txt");

        // if request is already cached
        if (cacheFile.exists() && !cacheFile.isDirectory()) {
            String cachedResponse = Files.readString(cacheFile.toPath());
            String newResponse = requestResponse(urlString);
            if (newResponse != null && !newResponse.equals(cachedResponse)) {
                // update cache
                try (BufferedWriter writer = new BufferedWriter(new FileWriter(cacheFile))) {
                    writer.write(newResponse);
                } catch (IOException e) {
                    System.err.println("Error: " + e.getMessage());
                }
            }
            System.out.println(cachedResponse);
        } else {
            String newResponse = requestResponse(urlString);
            if (newResponse != null) {
                // save to cache
                try (var writer = new BufferedWriter(new FileWriter(cacheFile))) {
                    writer.write(newResponse);
                } catch (IOException e) {
                    System.err.println("Error: " + e.getMessage());
                }
                System.out.println(newResponse);
            }
        }
    }

    private static String requestResponse(String urlString) {
        try {
            HttpURLConnection connection = establishConnection(urlString);
            String contentType = connection.getContentType();
            String responseString = getResponseBodyAsString(connection);
            String formattedResponse = null;

            if (contentType.contains("application/json")) {
                ObjectMapper objectMapper = new ObjectMapper();
                objectMapper.enable(SerializationFeature.INDENT_OUTPUT);
                JsonNode jsonNode = objectMapper.readTree(responseString);
                formattedResponse = objectMapper.writeValueAsString(jsonNode);
            } else if (contentType.contains("text/html")) {
                formattedResponse = Jsoup.parse(responseString).text();
            } else {
                System.out.println("Content type not supported.");
            }

            connection.disconnect();
            return formattedResponse;
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
            return null;
        }
    }

    private static HttpURLConnection establishConnection(String urlString) throws IOException {
        URL url = new URL(urlString);
        HttpURLConnection connection;
        int status;
        do {
            connection = (HttpURLConnection) url.openConnection();
            status = connection.getResponseCode();
            if (status == HttpURLConnection.HTTP_MOVED_TEMP || status == HttpURLConnection.HTTP_MOVED_PERM
                    || status == HttpURLConnection.HTTP_SEE_OTHER) {
                String redirectUrl = connection.getHeaderField("Location");
                connection.disconnect();
                url = new URL(redirectUrl);
            }
        } while (status == HttpURLConnection.HTTP_MOVED_TEMP || status == HttpURLConnection.HTTP_MOVED_PERM
                || status == HttpURLConnection.HTTP_SEE_OTHER);

        return connection;
    }

    private static String getResponseBodyAsString(HttpURLConnection connection) throws IOException {
        try (Scanner scanner = new Scanner(connection.getInputStream(), StandardCharsets.UTF_8).useDelimiter("\\A")) {
            return scanner.hasNext() ? scanner.next() : "";
        }
    }
}
