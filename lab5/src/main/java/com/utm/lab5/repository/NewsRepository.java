package com.utm.lab5.repository;

import com.utm.lab5.model.news.News;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NewsRepository extends JpaRepository<News, Long> {
    Optional<News> findByUserIdAndUrl(Long userId, String url);
    List<News> findAllByUserId(Long userId);
}
