package com.utm.lab5.model.news.gnews;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Article {
    private String title;
    private String description;
    private String content;
    private String url;
    private String image;
    private String publishedAt;
    private Source source;
}
