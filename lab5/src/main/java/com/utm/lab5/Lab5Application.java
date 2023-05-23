package com.utm.lab5;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

@SpringBootApplication
public class Lab5Application {

    public static void main(String[] args) throws TelegramApiException {
        SpringApplication.run(Lab5Application.class, args);

//        TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
//        Bot bot = new Bot();                  //We moved this line out of the register method, to access it later
//        botsApi.registerBot(bot);
//
//        bot.sendText(454513515L, "Hello World!");  //The L just turns the Integer into a Long
    }

}
