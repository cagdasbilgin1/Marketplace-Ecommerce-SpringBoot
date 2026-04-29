package com.marketplace.inventory.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
class OrderEventListener {

    private static final Logger log = LoggerFactory.getLogger(OrderEventListener.class);

    @RabbitListener(queues = "${app.messaging.queues.order-events}")
    void onOrderEvent(String payload) {
        log.info("Inventory workflow received order event: {}", payload);
    }
}
