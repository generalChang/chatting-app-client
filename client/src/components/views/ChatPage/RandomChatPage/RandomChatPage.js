import { Button, Divider, message, Row, Col, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { API_URL } from "../../../../Config";

import ChatInputBox from "./Sections/ChatInputBox";
import Messages from "./Sections/Messages";

const { Search } = Input;
function RandomChatPage() {
  const user = useSelector((state) => state.user);
  const [socket, setSocket] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const messageRef = useRef();

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    //setSocket(io("http://localhost:5000", { transports: ["websocket"] }));
    const sc = io(`${API_URL}`, { transports: ["websocket"] });
    setSocket(sc);

    sc.on("successMatching", (room_id) => {
      setRoomId(room_id);
      addMessage({
        username: "Manager-_-",
        msg: "Someone joined!! Enjoy your time!",
        image: "",
      });
      message.success("상대방과 매칭에 성공했습니다!");
    });

    sc.on("new_message", (obj) => {
      const { roomId, username, chatmsg, image } = obj;
      addMessage({
        username: username,
        msg: chatmsg,
        image: image,
      });
    });

    sc.on("leaveRandomChat", () => {
      message.success("채팅방에서 나가셨습니다.");
      setRoomId(null);
      setMessages((messages) => []);
    });
  }, []);

  useEffect(() => {
    scrollToBottom(); //메세지가 추가될떄마다 스크롤을 아래로 내려줌.
  }, [messages]);

  const addMessage = (msg) => {
    setMessages((messages) => [...messages, msg]);
  };

  const handleModal = (visible) => {
    setIsModalVisible(visible);
  };

  const onMakeChatRoom = (e) => {
    e.preventDefault();

    handleModal(true); //모달을 띄운다.
  };

  const updateChatSearch = (chatmsg) => {
    setChatSearch(chatmsg);

    socket.emit("new_message", {
      roomId: roomId,
      username: user.userData.name,
      chatmsg: chatmsg,
      image: user.userData.image,
    });
  };

  const onChatRoomLeave = (e) => {
    e.preventDefault();

    socket.emit("leaveRandomChat", {
      roomId: roomId,
    });
  };

  const onChatRoomSearch = (e) => {
    e.preventDefault();

    socket.emit(
      "searching",
      {
        username: user.userData.name,
        image: user.userData.image,
      },
      () => {
        message.warning("상대방을 찾고있습니다...");
      }
    ); // 상대방을 찾는중...
  };
  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <h2>랜덤채팅방</h2>
      </div>
      <Divider />

      <Row gutter={[32, 32]} style={{ marginTop: "4rem" }}>
        <Col lg={18} xs={24}>
          <div
            style={{ height: "65vh", maxHeight: "65vh", overflowY: "scroll" }}
            ref={messageRef}
          >
            <Messages messageList={messages} />
          </div>
          <div>
            <ChatInputBox updateChatSearch={updateChatSearch} />
          </div>
        </Col>

        <Col lg={6} xs={24}>
          {/*  현재 인원들을 보여주는 컴포넌트 */}

          {/* 나가기 버튼 */}
          <div>
            {!roomId && (
              <Button type="primary" onClick={onChatRoomSearch}>
                시작하기
              </Button>
            )}

            {roomId && (
              <Button type="dashed" danger onClick={onChatRoomLeave}>
                나가기
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default RandomChatPage;
