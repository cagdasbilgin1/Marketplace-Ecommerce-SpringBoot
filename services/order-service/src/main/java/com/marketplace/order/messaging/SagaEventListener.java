package com.marketplace.order.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
class SagaEventListener {

    private static final Logger log = LoggerFactory.getLogger(SagaEventListener.class);

    @RabbitListener(queues = "${app.messaging.queues.saga-events}")
    void onSagaEvent(String payload) {
        log.info("Order Saga received workflow event: {}", payload);
    }
}
