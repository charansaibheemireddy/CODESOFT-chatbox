import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Scanner;

public class ChatClient {
    private static final String API_URL = "http://127.0.0.1:5000/api/chat";

    public static void main(String[] args) {
        HttpClient client = HttpClient.newHttpClient();
        Scanner scanner = new Scanner(System.in);

        System.out.println("==========================================");
        System.out.println("☕ JAVA CLIENT -> PYTHON FLASK CHATBOT 🤖");
        System.out.println("Type your message or 'exit' to quit.");
        System.out.println("==========================================");

        while (true) {
            System.out.print("\nYou: ");
            String input = scanner.nextLine();
            if (input.equalsIgnoreCase("exit")) break;

            String jsonPayload = String.format("{\"message\": \"%s\"}", input.replace("\"", "\\\""));

            try {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create(API_URL))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                System.out.println("Nova AI (Python Backend): " + response.body());
            } catch (Exception e) {
                System.out.println("Error connecting to Python backend: " + e.getMessage());
            }
        }
        scanner.close();
    }
}
