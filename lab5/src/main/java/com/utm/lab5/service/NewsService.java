package com.utm.lab5.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.utm.lab5.model.news.News;
import com.utm.lab5.model.news.gnews.Article;
import com.utm.lab5.model.news.gnews.NewsResponse;
import com.utm.lab5.repository.NewsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NewsService {
    private final NewsRepository newsRepository;

    private static final String GNEWS_API_TOKEN = "f438ba2c564e19b808371ae7746411ee";
    private static final String NEWS_API_URL = "https://gnews.io/api/v4/search?max=5&q=%s%slang=en&token=" + GNEWS_API_TOKEN;
    private static final DateTimeFormatter GNEWS_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");
    private final RestTemplate restTemplate = new RestTemplate();

    private List<Article> getNews(String topic, String dateParam) {
        String url = String.format(NEWS_API_URL, topic, dateParam);

        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            // Parse response body
            String body = response.getBody();

            try {
                ObjectMapper objectMapper = new ObjectMapper();
                NewsResponse newsResponse = objectMapper.readValue(body, NewsResponse.class);

                List<Article> articles = newsResponse.getArticles();

                // Convert date to your preferred format
                DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssX", Locale.ENGLISH);
                SimpleDateFormat outputFormatter = new SimpleDateFormat("hh:mm dd-MM-yyyy");
                for (Article article : articles) {
                    ZonedDateTime zdt = ZonedDateTime.parse(article.getPublishedAt(), inputFormatter);
                    article.setPublishedAt(outputFormatter.format(Date.from(zdt.toInstant())));
                }

                return articles;
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to parse JSON response", e);
            }
        } else {
            return Collections.emptyList();
        }
    }

    public List<Article> latestNews(String topic) {
        List<Article> latestNews = getNews(topic, "&");

        // Sort articles by publishedAt in ascending order
        latestNews.sort(Comparator.comparing(Article::getPublishedAt));

        // Return the top 5 articles
        return latestNews.stream().limit(5).collect(Collectors.toList());
    }

    public List<Article> newsOn(String topic, LocalDate date) {
        String to = "&to=" + date.atStartOfDay(ZoneOffset.UTC).format(GNEWS_DATE_FORMATTER);
        String from = "&from=" + date.minusDays(1).atStartOfDay(ZoneOffset.UTC).format(GNEWS_DATE_FORMATTER);
        List<Article> allNews = getNews(topic, to + from + "&");

        // Sort articles by publishedAt in descending order
        allNews.sort(Comparator.comparing(Article::getPublishedAt).reversed());

        // Return the top 5 articles
        return allNews.stream().limit(5).collect(Collectors.toList());
    }

    @Transactional
    public boolean saveNews(Long userId, String url) {
        Optional<News> optionalNews = getNews(userId, url);

        if (optionalNews.isPresent()) {
            return false;
        }

        News news = new News();
        news.setUrl(url);
        news.setUserId(userId);
        newsRepository.save(news);
        return true;
    }

    @Transactional
    public boolean removeNews(Long userId, String url) {
        Optional<News> optionalNews = getNews(userId, url);

        if (optionalNews.isPresent()) {
            newsRepository.delete(optionalNews.get());
            return true;
        }

        return false;
    }


    @Transactional(readOnly = true)
    public Optional<News> getNews(Long userId, String url) {
        return newsRepository.findByUserIdAndUrl(userId, url);
    }

    @Transactional(readOnly = true)
    public List<News> getUserNews(Long userId) {
        return newsRepository.findAllByUserId(userId);
    }
}
