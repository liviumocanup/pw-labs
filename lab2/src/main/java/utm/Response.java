package utm;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.OutputStream;

public class Response {
    public static SSLSocket establish(String host, String path) throws IOException {
        SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
        SSLSocket socket = (SSLSocket) factory.createSocket(host, 443);
        socket.startHandshake();

        OutputStream os = socket.getOutputStream();
        String request = "GET " + path + " HTTP/1.1\r\n" +
                "Host: " + host + "\r\n" +
                "Connection: close\r\n\r\n";
        os.write(request.getBytes());
        os.flush();

        return socket;
    }

    public static int getResponseStatus(BufferedReader in) throws IOException {
        String statusLine = in.readLine();
        String[] statusTokens = statusLine.split(" ");
        return Integer.parseInt(statusTokens[1]);
    }

    public static String getHeader(BufferedReader in, String headerName) throws IOException {
        String headerLine;
        while ((headerLine = in.readLine()) != null) {
            if (headerLine.toLowerCase().startsWith(headerName.toLowerCase() + ":")) {
                return headerLine.substring(headerLine.indexOf(":") + 1).trim();
            }
        }
        return null;
    }

    public static String getResponseBodyAsString(BufferedReader in) throws IOException {
        StringBuilder responseBuilder = new StringBuilder();
        String inputLine;

        // Read and discard the headers
        while ((inputLine = in.readLine()) != null) {
            if (inputLine.trim().isEmpty()) {
                inputLine = in.readLine();
                if (inputLine.startsWith("{")) {
                    responseBuilder.append(inputLine);
                }
                break;
            }
        }

        // Read the response body
        while ((inputLine = in.readLine()) != null) {
            responseBuilder.append(inputLine);
            responseBuilder.append("\n");
        }

        return responseBuilder.toString();
    }
}
