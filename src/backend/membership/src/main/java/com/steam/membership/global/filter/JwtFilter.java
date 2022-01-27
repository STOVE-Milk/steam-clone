package com.steam.membership.global.filter;

import com.steam.membership.global.common.UserContext;
import com.steam.membership.global.common.UserDetails;
import com.steam.membership.global.util.JwtUtil;
import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

public class JwtFilter implements Filter {
    private final String AUTHORIZATION_HEADER = "Authorization";
    private final String TOKEN_PREFIX = "Bearer ";

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        Filter.super.init(filterConfig);
    }

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

