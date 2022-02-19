package com.steam.library.global.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMQConfig {
    private static final String EXCHANGE_NAME = "steam.lobby";
    private static final String QUEUE_NAME = "lobby.queue";
    private static final String ROUTING_KEY = "lobby.normal";

    @Bean
    TopicExchange exchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }
    @Bean
    Queue queue() {
        Map<String, Object> arguments = new HashMap<>();
        arguments.put( "x-queue-type" , "stream" ); // Stream 큐 사용을 위한 필수 인수
        arguments.put("x-max-length-bytes", 20000000000L); // maximum stream size: 20 GB
        arguments.put("x-stream-max-segment-size-bytes", 100000000); // size of segment files: 100 MB
        return new Queue(QUEUE_NAME, true, false, false, arguments);
    }
    @Bean
    Binding binding (Queue queue, TopicExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
    }
    @Bean
    RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(new Jackson2JsonMessageConverter());
        return rabbitTemplate;
    }
}

//출처: https://oingdaddy.tistory.com/166