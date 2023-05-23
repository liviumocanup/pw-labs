package com.utm.lab5.model.news.gnews;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class NewsResponse {
    private int totalArticles;
    private List<Article> articles;
}