package com.steam.membership.global.config;

import com.steam.membership.global.filter.JwtFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {
    public FilterConfig() {
    }

    @Bean
    public FilterRegistrationBean<JwtFilter> jwtValidationFilterRegister() {
        FilterRegistrationBean<JwtFilter> registrationBean = new FilterRegistrationBean<>();
        registrationBean.setFilter(new JwtFilter());
        registrationBean.setOrder(1);
        return registrationBean;
    }
}
