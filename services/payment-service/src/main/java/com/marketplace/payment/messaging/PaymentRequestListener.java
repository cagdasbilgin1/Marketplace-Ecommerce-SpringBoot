package com.marketplace.payment.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
class PaymentRequestListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentRequestListener.class);

    @RabbitListener(queues = "${app.messaging.queues.payment-requests}")
    void onPaymentRequested(String payload) {
        log.info("Payment workflow received payment request: {}", payload);
    }
}
