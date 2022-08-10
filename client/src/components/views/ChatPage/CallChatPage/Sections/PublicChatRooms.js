import React from "react";
import { withRouter } from "react-router-dom";
import { Col, Card, Avatar, Divider, Tooltip } from "antd";

function PublicChatRooms(props) {
  const onEnterChatRoom = (roomId) => {
    props.handleEnterRoom(roomId);
  };
  const renderCards =
    props.chatRooms &&
    props.chatRooms.map((roomInfo, index) => {
      const parse = JSON.parse(roomInfo.roomId);
      return (
        <Col lg={8} md={12} xs={24}>
          <a
            onClick={() => {
              onEnterChatRoom(roomInfo.roomId);
            }}
          >
            <Tooltip title="클릭해서 채팅방에 입장해보세요!">
              <div
                style={{
                  width: "100%",
                  height: "150px",
                  padding: "1rem",
                  border: "1px solid #cccccc",
                  borderRadius: "9px",
                }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    fontWeight: "800",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                >
                  <h6>{parse.roomname}</h6>
                </div>
                <hr />
                <div>
                  <p>인원 : {roomInfo.userCount}</p>
                </div>
              </div>
            </Tooltip>
          </a>
        </Col>
      );
    });

  return renderCards;
}

export default withRouter(PublicChatRooms);
