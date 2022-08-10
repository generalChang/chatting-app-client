import { Button, Input, Form, message } from "antd";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";

function ChatInputBox(props) {
  const [chatMessage, setChatMessage] = useState("");
  const onChatMessageChange = (e) => {
    setChatMessage(e.currentTarget.value);
  };
  const onChatMessageSearch = (e) => {
    e.preventDefault();

    if (chatMessage.trim() === "" || chatMessage === null) {
      message.warning("메세지를 입력해주세요");
      return;
    }
    props.updateChatSearch(chatMessage);
    setChatMessage("");
  };

  return (
    <div>
      <Form onSubmit={onChatMessageSearch} style={{ display: "flex" }}>
        <Input
          placeholder="input search text"
          size="large"
          onChange={onChatMessageChange}
          value={chatMessage}
        />
        <Button
          type="primary"
          danger
          size="large"
          onClick={onChatMessageSearch}
          htmlType="submit"
        >
          Send
        </Button>
      </Form>
    </div>
  );
}

export default withRouter(ChatInputBox);
