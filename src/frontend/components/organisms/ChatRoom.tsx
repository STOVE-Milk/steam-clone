import React, { useEffect, useState, useRef } from 'react';
import type { NextPage } from 'next';

interface Log {
  //채팅방 메세지 객체 타입
  sender_id: string;
  sender_nickname: string[];
  content: string;
  send_time: string;
}

export interface IChatRoomProps {
  members: string[];
  logs: Log[];
  message: Log;
}

const ChatRoom: NextPage = () => {
  const [members, setMembers] = useState<string[]>(); // 채팅방 멤버들
  const [logs, setLogs] = useState<Log[]>(); // 채팅방 메세지들
  const [message, setMessage] = useState({} as Log); //현재 보낼 메세지, 받을 메세지

  return <div></div>;
};

export default ChatRoom;
