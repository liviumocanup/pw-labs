package com.utm.lab5.controller;

import com.utm.lab5.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.telegram.telegrambots.meta.api.objects.Update;

@RestController
@RequiredArgsConstructor
public class TelegramBotController {

    private final MessageService messageService;

    @PostMapping(value = "/update", consumes = "application/json")
    public void receiveUpdate(@RequestBody Update update) {
        messageService.receiveUpdate(update);
    }
}
