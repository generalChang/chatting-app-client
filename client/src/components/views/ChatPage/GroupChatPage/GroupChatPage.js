import { Button, Divider, message, Row, Col, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { API_URL } from "../../../../Config";
import ChatModal from "../../../utils/ChatModal";
import { GROUP_CHAT } from "../datas";

import ChatInputBox from "./Sections/ChatInputBox";
import Messages from "./Sections/Messages";
import PublicChatRooms from "./Sections/PublicChatRooms";
const { Search } = Input;
function GroupChatPage() {
  const user = useSelector((state) => state.user);
  const [socket, setSocket] = useState("");
  const [roomname, setRoomname] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState("");
  const [chatSearch, setChatSearch] = useState("");
  const messageRef = useRef();
  const [chatRooms, setChatRooms] = useState([]);

  const scrollToBottom = () => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    //setSocket(io("http://localhost:5000", { transports: ["websocket"] }));
    const sc = io(`${API_URL}`, { transports: ["websocket"] });
    setSocket(sc);
    sc.on("welcome", (usernickname, room_id, image) => {
      const parse = JSON.parse(room_id);
      addMessage({
        username: usernickname,
        msg: `${usernickname}, join this chatroom!! welcome!`,
        image: image,
      });
    });

    sc.on("new_message", (obj) => {
      const { roomId, username, chatmsg, image } = obj;
      addMessage({
        username: username,
        msg: chatmsg,
        image: image,
      });
    });

    sc.on("publicRooms", (roomIds) => {
      console.log(roomIds);
      setChatRooms(roomIds);
    });

    sc.on("leave", (obj) => {
      const { roomId, username, image } = obj;
      addMessage({
        username: username,
        msg: `${username}, leave this chatroom.. TT`,
        image: image,
      });
    });

    sc.emit("publicRooms", GROUP_CHAT);
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

    // socket.emit("enter_room", { roomname: "room123", type: "call" });
  };

  const onWriteMyroomname = (search) => {
    socket.emit(
      "create_room",
      {
        username: user.userData.name,
        roomname: search,
        roomtype: GROUP_CHAT,
        image: user.userData.image,
      },
      (usernickname, room_id, image) => {
        message.success("채팅방 생성 완료!!");
        const parse = JSON.parse(room_id);
        setRoomId(room_id);
        setRoomname(parse.roomname);
        setMessages((messages) => []);
        addMessage({
          username: usernickname,
          msg: `${usernickname}, join this chatroom!! welcome!`,
          image: image,
        });
        socket.emit("publicRooms", GROUP_CHAT);
      }
    );
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

    socket.emit(
      "leave",
      {
        roomId: roomId,
        username: user.userData.name,
        image: user.userData.image,
      },
      () => {
        message.success("채팅방에서 나가셨습니다.");
        setRoomId(null);
        setMessages((messages) => []);
        socket.emit("publicRooms", GROUP_CHAT);
      }
    );
  };

  const handleEnterRoom = (roomId) => {
    socket.emit(
      "enter_room",
      {
        roomId: roomId,
        username: user.userData.name,
        image: user.userData.image,
        roomtype: GROUP_CHAT,
      },
      (usernickname, image) => {
        message.success("채팅방에 입장하셨습니다.");
        setRoomId(roomId);
        setMessages((messages) => []);
        addMessage({
          username: usernickname,
          msg: `${usernickname}, join this chatroom!! welcome!`,
          image: image,
        });
        socket.emit("publicRooms", GROUP_CHAT);
      }
    );
  };
  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {roomId === null ? <h2>채팅방 목록</h2> : <h2>{roomname}</h2>}
      </div>
      <Divider />

      {!roomId && (
        <div>
          <Button danger onClick={onMakeChatRoom} style={{ float: "right" }}>
            채팅방 만들기
          </Button>

          <ChatModal
            visible={isModalVisible}
            handleModal={handleModal}
            onWriteMyroomname={onWriteMyroomname}
          />
          <Row gutter={[32, 32]}>
            <PublicChatRooms
              chatRooms={chatRooms}
              handleEnterRoom={handleEnterRoom}
            />
          </Row>
        </div>
      )}

      {roomId && (
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
              <Button type="dashed" danger onClick={onChatRoomLeave}>
                나가기
              </Button>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
}

export default GroupChatPage;
