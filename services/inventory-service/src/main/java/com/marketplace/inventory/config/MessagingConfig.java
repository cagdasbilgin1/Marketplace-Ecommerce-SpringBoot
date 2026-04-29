package com.marketplace.inventory.config;

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
    Queue inventoryOrderEventsQueue(@Value("${app.messaging.queues.order-events}") String queueName) {
        return QueueBuilder.durable(queueName).build();
    }

    @Bean
    Binding orderCreatedBinding(Queue inventoryOrderEventsQueue, TopicExchange marketplaceExchange) {
        return BindingBuilder.bind(inventoryOrderEventsQueue).to(marketplaceExchange).with("order.created");
    }

    @Bean
    Binding orderCancelledBinding(Queue inventoryOrderEventsQueue, TopicExchange marketplaceExchange) {
        return BindingBuilder.bind(inventoryOrderEventsQueue).to(marketplaceExchange).with("order.cancelled");
    }
}
