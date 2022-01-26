package com.steam.library.global.interceptor;

import com.steam.library.global.common.UserDetails;
import com.steam.library.global.error.CustomException;
import com.steam.library.global.error.ErrorCode;
import com.steam.library.global.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.lang.Nullable;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import javax.servlet.http.HttpSession;
import java.util.Enumeration;
import java.util.Map;

@Slf4j
public class WebSocketHandshakeInterceptor extends HttpSessionHandshakeInterceptor {
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String TOKEN_PREFIX = "Bearer ";
    private static final String USER_ID = "user_id";
    private static final String NICKNAME = "nickname";

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        String accessToken = request.getHeaders().get(AUTHORIZATION_HEADER).get(0);
        if(accessToken == null) {
            log.info("헤더의 Authorization 속성의 값이 없음(access token이 없음)");
            return false;
        }
        accessToken = accessToken.substring(TOKEN_PREFIX.length());

        UserDetails userDetails = JwtUtil.getPayload(accessToken);
        if(userDetails == null) {
            log.info("access token은 있으나 UserDetails 변환 과정에서 오류");
            return false;
        }


        HttpSession session = getSession(request);
        if (session != null) {
            if (isCopyHttpSessionId()) {
                attributes.put(HTTP_SESSION_ID_ATTR_NAME, session.getId());
            }
            Enumeration<String> names = session.getAttributeNames();
            while (names.hasMoreElements()) {
                String name = names.nextElement();
                if (isCopyAllAttributes() || getAttributeNames().contains(name)) {
                    attributes.put(name, session.getAttribute(name));
                }
            }
        }

        session.setAttribute(USER_ID, userDetails.getIdx());
        session.setAttribute(NICKNAME, userDetails.getNickname());

        return true;
    }

    @Nullable
    private HttpSession getSession(ServerHttpRequest request) {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest serverRequest = (ServletServerHttpRequest) request;
            return serverRequest.getServletRequest().getSession(isCreateSession());
        }
        return null;
    }
}
