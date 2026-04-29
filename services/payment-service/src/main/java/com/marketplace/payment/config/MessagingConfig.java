package com.marketplace.payment.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class MessagingConfig {

    @Bean
    TopicExchange marketplaceExchange(@Value("${app.messaging.exchange}") String exchangeName) {
        return new TopicExchange(exchangeName, true, false);
    }

    @Bean
    Queue paymentRequestsQueue(@Value("${app.messaging.queues.payment-requests}") String queueName) {
        return QueueBuilder.durable(queueName).build();
    }

    @Bean
    Binding paymentRequestedBinding(Queue paymentRequestsQueue, TopicExchange marketplaceExchange) {
        return BindingBuilder.bind(paymentRequestsQueue).to(marketplaceExchange).with("order.payment.requested");
    }
}
