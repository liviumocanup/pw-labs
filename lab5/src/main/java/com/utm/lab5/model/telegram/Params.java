package com.utm.lab5.model.telegram;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.InlineKeyboardMarkup;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Getter
public class Params {
    private String callback_query_id;
    private Long chat_id;
    private Integer message_id;
    private String parse_mode;
    private String text;
    private InlineKeyboardMarkup reply_markup;
    private boolean disable_web_page_preview;

    public Params withCallbackQueryId(String callbackQueryId) {
        this.callback_query_id = callbackQueryId;
        return this;
    }

    public Params withChatId(Long chatId) {
        this.chat_id = chatId;
        return this;
    }

    public Params withMessageId(Integer msgId) {
        this.message_id = msgId;
        return this;
    }

    public Params withParseMode(String parseMode) {
        this.parse_mode = parseMode;
        return this;
    }

    public Params withText(String text) {
        this.text = text;
        return this;
    }

    public Params withInlineKeyboardMarkup(InlineKeyboardMarkup replyMarkup) {
        this.reply_markup = replyMarkup;
        return this;
    }

    public Params withWebPreview(boolean webPreview) {
        this.disable_web_page_preview = !webPreview;
        return this;
    }

    @Override
    public String toString() {
        return "Params{" +
                "callback_query_id='" + callback_query_id + '\'' +
                ", chat_id=" + chat_id +
                ", message_id=" + message_id +
                ", parse_mode='" + parse_mode + '\'' +
                ", text='" + text + '\'' +
                ", reply_markup=" + reply_markup +
                ", disable_web_page_preview=" + disable_web_page_preview +
                '}';
    }
}
