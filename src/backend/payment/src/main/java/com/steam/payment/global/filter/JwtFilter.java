package com.steam.payment.global.filter;

import com.steam.payment.global.common.UserContext;
import com.steam.payment.global.common.UserDetails;
import com.steam.payment.global.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Enumeration;

@Slf4j
public class JwtFilter implements Filter {
    private final String AUTHORIZATION_HEADER = "Authorization";
    private final String TOKEN_PREFIX = "Bearer ";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

    /*
        API Gateway에서 검증이 됐다고 판단하여 Secret Key를 이용해 검증을 하지 않고,
        JWT Payload의 데이터를 해석해서 UserDetails로 Deserialize합니다.
        UserDetails는 ThreadLocal에 저장하여 쓰레드 내에서 공유하며 사용합니다.
    */
    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;

        if(!request.getMethod().equals("OPTIONS")) {
            String accessToken = request.getHeader(AUTHORIZATION_HEADER).substring(TOKEN_PREFIX.length());
            UserDetails userDetails = JwtUtil.getPayload(accessToken);
            UserContext.setUserDetails(userDetails);
        }

        chain.doFilter(servletRequest, servletResponse);
    }

    @Override
    public void destroy() {
        UserContext.removeUserDetails();
        Filter.super.destroy();
    }
}
