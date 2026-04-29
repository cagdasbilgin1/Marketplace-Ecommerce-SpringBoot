package com.marketplace.notification.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
class NotificationEventListener {

    private static final Logger log = LoggerFactory.getLogger(NotificationEventListener.class);

    @RabbitListener(queues = "${app.messaging.queues.notification-events}")
    void onNotificationEvent(String payload) {
        log.info("Notification workflow received event: {}", payload);
    }
}
