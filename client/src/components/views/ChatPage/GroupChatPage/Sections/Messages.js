import React from "react";
import { Comment, Avatar, Divider } from "antd";
function Messages(props) {
  return (
    <div>
      {props.messageList &&
        props.messageList.map((message, index) => {
          return (
            <>
              <Comment
                author={`${message.username}`}
                avatar={<Avatar src={`${message.image}`} />}
                content={<p>{message.msg}</p>}
              ></Comment>
            </>
          );
        })}
    </div>
  );
}

export default Messages;
