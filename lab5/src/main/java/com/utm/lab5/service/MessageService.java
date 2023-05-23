package com.utm.lab5.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utm.lab5.model.news.News;
import com.utm.lab5.model.news.gnews.Article;
import com.utm.lab5.model.telegram.Params;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.User;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.InlineKeyboardButton;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final NewsService newsService;

    private static final String API_URL = "https://api.telegram.org/bot";
    private static final String BOT_TOKEN = "6165101904:AAFbRPWQJWgVY9lRqSDFv5M1xAAzJTMTgqU";


    private static final String SEND = "/sendMessage";
    private static final String EDIT = "/editMessageText";
    private static final String ANSWER_CALLBACK = "/answerCallbackQuery";


    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    InlineKeyboardButton next = InlineKeyboardButton.builder()
            .text("Next").callbackData("next")
            .build();

    InlineKeyboardButton nature = InlineKeyboardButton.builder()
            .text("Nature").callbackData("nature")
            .build();

    InlineKeyboardButton gaming = InlineKeyboardButton.builder()
            .text("Gaming").callbackData("gaming")
            .build();

    InlineKeyboardButton programming = InlineKeyboardButton.builder()
            .text("Programming").callbackData("programming")
            .build();

    InlineKeyboardButton politics = InlineKeyboardButton.builder()
            .text("Politics").callbackData("politics")
            .build();

    InlineKeyboardButton music = InlineKeyboardButton.builder()
            .text("Music").callbackData("music")
            .build();

    InlineKeyboardButton back = InlineKeyboardButton.builder()
            .text("Back").callbackData("back")
            .build();

    InlineKeyboardButton url = InlineKeyboardButton.builder()
            .text("Tutorial")
            .url("https://www.masterclass.com/articles/how-to-be-more-decisive")
            .build();

    private final InlineKeyboardMarkup keyboardM1 = InlineKeyboardMarkup.builder()
            .keyboardRow(List.of(nature, gaming, programming))
            .keyboardRow(List.of(next))
            .build();

    //Buttons are wrapped in lists since each keyboard is a set of button rows
    private final InlineKeyboardMarkup keyboardM2 = InlineKeyboardMarkup.builder()
            .keyboardRow(List.of(politics, music))
            .keyboardRow(List.of(url))
            .keyboardRow(List.of(back))
            .build();

    public void receiveUpdate(Update update) {
        if (update.hasCallbackQuery()) {
            processCallbackQuery(update);
            return;
        }

        var msg = update.getMessage();
        var user = msg.getFrom();
        var userId = user.getId();

        var txt = msg.getText();
        if (msg.isCommand()) {
            switch (txt) {
                case "/start" -> greeting(user);
                case "/saved_news" -> retrieveNews(userId);
                case "/menu" -> menu(userId);
                case "/help" -> help(userId);
                default -> {
                    if (txt.startsWith("/latest_news")) latestNews(userId, txt);
                    else if (txt.startsWith("/news_on")) newsOn(userId, txt);
                    else if (txt.startsWith("/save_news")) saveNews(userId, txt);
                    else if (txt.startsWith("/remove_news")) removeNews(userId, txt);
                    else sendNotification(userId, "Unknown command. Check your spelling and try again!");
                }
            }
            return;
        }

        sendNotification(userId, "Sorry, I'm mostly a news bot. \uD83D\uDE14 " +
                "The main way of interacting with me is through commands. (try /help) \uD83E\uDD13");
    }

    private void processCallbackQuery(Update update) {
        var query = update.getCallbackQuery();
        var user = query.getFrom();
        var data = query.getData();
        var msgId = query.getMessage().getMessageId();

        try {
            buttonTap(user.getId(), query.getId(), data, msgId);
        } catch (TelegramApiException e) {
            throw new RuntimeException(e);
        }
    }

    private void buttonTap(Long chatId, String queryId, String data, int msgId) throws TelegramApiException {
        Params params = new Params()
                .withChatId(chatId)
                .withMessageId(msgId)
                .withParseMode("HTML");

        switch (data) {
            case "next" -> {
                params = params
                        .withText("<b>(Page 2)</b> Maybe you like <em>these</em> topics more?")
                        .withInlineKeyboardMarkup(keyboardM2);
                sendMessage(params, EDIT);
            }
            case "back" -> {
                params = params
                        .withText("<b>(Page 1)</b> Just choose some news already:")
                        .withInlineKeyboardMarkup(keyboardM1);
                sendMessage(params, EDIT);
            }
            case "nature" -> latestNews(chatId, "/latest_news nature");
            case "gaming" -> latestNews(chatId, "/latest_news gaming");
            case "programming" -> latestNews(chatId, "/latest_news programming");
            case "politics" -> latestNews(chatId, "/latest_news politics");
            case "music" -> latestNews(chatId, "/latest_news music");
        }

        params = new Params().withCallbackQueryId(queryId);
        sendMessage(params, ANSWER_CALLBACK);
    }

    private void help(Long userId) {
        String txt = """
                <b>Base functionality</b>:
                - /start - to show my greeting;
                - /latest_news with optional parameter <em>`topic`</em> - to search for latest news on some topic (up to 5 links);
                - /save_news with required parameter <em>`url`</em> - to add the URL to your saved news;
                - /saved_news - to show your list of saved news.
                                
                <b>Additional logic</b>:
                - /news_on with required parameter <em>`date`</em> (dd/MM/yyyy) and optional parameter <em>`topic`</em> - to search for news on some topic for a certain day (up to 5 links);
                - /remove_news with required parameter <em>`url`</em> - to remove the URL from your saved news;
                - /menu - to show a menu of topics you could choose to see the latest news of (2 pages);
                - /help - to see the list of supported commands.
                """;

        Params params = new Params()
                .withChatId(userId)
                .withText(txt)
                .withParseMode("HTML");

        sendMessage(params, SEND);
    }

    private void greeting(User user) {
        String txt = "Welcome, " + user.getFirstName() + ". " +
                "I am a news fetching bot made by Newsroom SRL. \uD83E\uDDD0";

        sendNotification(user.getId(), txt);
    }

    private void menu(Long userId) {
        Params params = new Params()
                .withChatId(userId)
                .withText("<b>(Page 1)</b> Click a button to get the latest news for that topic:")
                .withParseMode("HTML")
                .withInlineKeyboardMarkup(keyboardM1);

        sendMessage(params, SEND);
    }

    private void latestNews(Long chatId, String txt) {
        String topic = txt.length() > "/latest_news".length() ? txt.substring("/latest_news".length()).trim() : "general";

        List<Article> articles = newsService.latestNews(topic);

        if (articles.isEmpty()) {
            sendNotification(chatId, "No news on this topic were found. \uD83D\uDE22" +
                    " Check your spelling or pick another topic!");
        } else {
            sendArticles(chatId, articles);
        }
    }

    private void newsOn(Long userId, String txt) {
        if (txt.length() <= "/news_on".length()) {
            sendNotification(userId, "Date not provided. Command format is: /news_on DD/MM/YYYY [topic]");
            return;
        }

        String dateAndTopic = txt.substring("/news_on".length()).trim();
        String[] split = dateAndTopic.split("\\s+", 2);

        String dateStr = split[0];
        String topic = split.length > 1 ? split[1] : "general";

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        LocalDate date;
        try {
            date = LocalDate.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            sendNotification(userId, "Invalid date format. Use DD/MM/YYYY.");
            return;
        }

        List<Article> articles = newsService.newsOn(topic, date);

        if (articles.isEmpty()) {
            sendNotification(userId, "No news on this topic and date were found. \uD83D\uDE22" +
                    " Check your spelling or pick another topic/date!");
        } else {
            sendArticles(userId, articles);
        }
    }

    private void sendArticles(Long userId, List<Article> articles) {
        sendNotification(userId, articles.size() + " news were found:");

        for (Article article : articles) {
            String message = String.format(
                    """
                            <b>Title:</b> %s
                            <b>Description:</b> %s
                            <b>Source:</b> <em>%s</em>
                            <b>URL:</b> %s
                            <b>Published at:</b> %s
                            """,
                    article.getTitle(),
                    article.getDescription(),
                    article.getSource().getName(),
                    article.getUrl(),
                    article.getPublishedAt()
            );

            Params params = new Params()
                    .withChatId(userId)
                    .withText(message)
                    .withParseMode("HTML")
                    .withWebPreview(true);

            sendMessage(params, SEND);
        }
    }

    private void saveNews(Long userId, String txt) {
        String url;
        if (txt.length() > "/save_news".length()) url = txt.substring("/save_news".length()).trim();
        else {
            sendNotification(userId, "Whoops! You didn't provide the url of the article you want to save.");
            return;
        }

        if (newsService.saveNews(userId, url)) {
            sendNotification(userId, "Successfully saved!");
        } else {
            sendNotification(userId, "You already have this article saved.");
        }
    }

    private void removeNews(Long userId, String txt) {
        String url;
        if (txt.length() > "/remove_news".length()) url = txt.substring("/remove_news".length()).trim();
        else {
            sendNotification(userId, "Whoops! You didn't provide the url of the article you want to remove.");
            return;
        }

        if (newsService.removeNews(userId, url)) {
            sendNotification(userId, "Successfully removed!");
        } else {
            sendNotification(userId, "You don't have such an article saved.");
        }
    }

    private void retrieveNews(Long userId) {
        List<News> newsList = newsService.getUserNews(userId);

        if (newsList.isEmpty()) {
            sendNotification(userId, "Looks empty here. Try to add some news first!");
        } else {
            sendNotification(userId, "You stored " + newsList.size() + " news:");

            for (News news : newsList) {
                String message = "<b>URL:</b> " + news.getUrl();

                Params params = new Params()
                        .withChatId(userId)
                        .withText(message)
                        .withParseMode("HTML")
                        .withWebPreview(true);

                sendMessage(params, SEND);
            }
        }
    }

    private void sendNotification(Long userId, String text) {
        Params params = new Params()
                .withChatId(userId)
                .withText(text);

        sendMessage(params, SEND);
    }

    private void sendMessage(Params params, String method) {
        String url = API_URL + BOT_TOKEN + method;

        // Convert parameters to JSON
        String json;
        try {
            json = objectMapper.writeValueAsString(params);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert parameters to JSON", e);
        }

        // Create the HTTP headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Create the HTTP entity (headers + body)
        HttpEntity<String> entity = new HttpEntity<>(json, headers);

        // Send the request
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);

        // Optional: check the response status code and/or body
        if (!response.getStatusCode().is2xxSuccessful()) {
            System.out.println("Failed to send message: " + response.getBody());
        }
    }
}
