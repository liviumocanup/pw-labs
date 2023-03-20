package utm;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.jsoup.Jsoup;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.net.ssl.SSLSocket;

public class Scrapper {

    private static BufferedReader in;
    private final static int HTTP_MOVED_PERM = 301;
    private final static int HTTP_MOVED_TEMP = 302;
    private final static int HTTP_SEE_OTHER = 303;

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
            SSLSocket socket = establishConnection(urlString);
            String contentType = getHeader(in, "Content-Type");
            String responseString = getResponseBodyAsString(in);
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

            socket.close();
            return formattedResponse;
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
            return null;
        }
    }

    private static SSLSocket establishConnection(String urlString) throws IOException {
        URL url = new URL(urlString);
        SSLSocket socket;
        int status;
        do {
            socket = Response.establish(url.getHost(), url.getPath());

            in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            status = getResponseStatus(in);
            if (status == HTTP_MOVED_TEMP || status == HTTP_MOVED_PERM || status == HTTP_SEE_OTHER) {
                String redirectUrl = getHeader(in, "Location");
                socket.close();
                url = new URL(redirectUrl);
            }
        } while (status == HTTP_MOVED_TEMP || status == HTTP_MOVED_PERM || status == HTTP_SEE_OTHER);

        return socket;
    }

    private static int getResponseStatus(BufferedReader in) throws IOException {
        return Response.getResponseStatus(in);
    }

    private static String getHeader(BufferedReader in, String headerName) throws IOException {
        return Response.getHeader(in, headerName);
    }

    public static String getResponseBodyAsString(BufferedReader in) throws IOException {
        return Response.getResponseBodyAsString(in);
    }
}
