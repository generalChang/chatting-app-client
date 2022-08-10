import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Modal, Input } from "antd";
const { Search } = Input;
function ChatModal(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [myroomname, setMyroomname] = useState("");
  const handleOk = () => {
    setIsModalVisible(false);
    props.handleModal(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    props.handleModal(false);
  };

  const onWriteMyroomname = (value) => {
    setMyroomname(value);
    props.onWriteMyroomname(value);
  };

  return (
    <div>
      <Modal
        title="채팅방 이름 검색"
        visible={props.visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Search
          placeholder="create your room name!!"
          onSearch={onWriteMyroomname}
          enterButton
        />
      </Modal>
    </div>
  );
}

export default withRouter(ChatModal);
