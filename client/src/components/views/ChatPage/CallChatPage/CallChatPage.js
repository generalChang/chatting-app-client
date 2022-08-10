import { Button, Divider, message, Row, Col, Input } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import { API_URL } from "../../../../Config";
import ChatModal from "../../../utils/ChatModal";
import { VIDEO_CALL } from "../datas";
import PublicChatRooms from "./Sections/PublicChatRooms";

const { Search } = Input;
let myStream = null;
function CallChatPage() {
  const user = useSelector((state) => state.user);
  const [socket, setSocket] = useState("");
  const [roomname, setRoomname] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  // const [myStream, setMyStream] = useState(null);
  const [cameraOptions, setCameraOptions] = useState([]);
  const myVideoRef = useRef();
  const peerFace = useRef();
  const myPeerConnection = useRef();
  const mySocket = useRef();

  const [cameraOff, setCameraOff] = useState(false);
  const [muted, setMuted] = useState(false);

  let room__id = null;
  useEffect(() => {
    //setSocket(io("http://localhost:5000", { transports: ["websocket"] }));

    const sc = io(`${API_URL}`, { transports: ["websocket"] });
    setSocket(sc);
    sc.on("welcome", async (usernickname, room_id, image) => {
      const parse = JSON.parse(room_id);

      const offer = await myPeerConnection.current.createOffer();
      myPeerConnection.current.setLocalDescription(
        new RTCSessionDescription(offer)
      );

      //이제 offer를 전송해야함.
      //offer는 일종의 초대장임.
      //offer를 주고받은 순간 직접적으로 통신가능함.
      sc.emit("offer", offer, room_id);
    });

    sc.on("new_message", (obj) => {
      const { roomId, username, chatmsg, image } = obj;
    });

    sc.on("leave", (obj) => {
      const { roomId, username, image } = obj;
      message.warning("상대방이 나갔습니다.");
    });

    sc.emit("publicRooms", VIDEO_CALL);

    sc.on("publicRooms", (roomIds) => {
      console.log(roomIds);
      setChatRooms(roomIds);
    });

    sc.on("offer", async (offer, room_Id) => {
      console.log("offer");
      myPeerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      //remotedescription : 초대장을 날린 브라우저의 decription을 의미함.

      const answer = await myPeerConnection.current.createAnswer();
      myPeerConnection.current.setLocalDescription(
        new RTCSessionDescription(answer)
      );

      sc.emit("answer", answer, room_Id);
    });

    sc.on("answer", (answer, room_Id) => {
      console.log("answer");
      myPeerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    sc.on("ice", (ice) => {
      myPeerConnection.current.addIceCandidate(ice);
    });

    mySocket.current = sc;
  }, []);

  async function initCall() {
    await getMedia(); //
    makeConnection();
  }

  const handleModal = (visible) => {
    setIsModalVisible(visible);
  };

  const onMakeChatRoom = (e) => {
    e.preventDefault();

    handleModal(true); //모달을 띄운다.
  };

  const onWriteMyroomname = (search) => {
    // 방에 입장했을때.
    socket.emit(
      "create_room",
      {
        username: user.userData.name,
        roomname: search,
        roomtype: VIDEO_CALL,
        image: user.userData.image,
      },
      async (usernickname, room_id, image) => {
        message.success("채팅방 생성 완료!!");
        const parse = JSON.parse(room_id);

        setRoomId(room_id);
        setRoomname(parse.roomname);
        room__id = room_id;
        await initCall();
        socket.emit("publicRooms", VIDEO_CALL);
      }
    );
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
        socket.emit("publicRooms", VIDEO_CALL);
        window.location.replace("/");
        message.success("채팅방에서 나가셨습니다.");
      }
    );
  };

  const handleEnterRoom = async (roomId) => {
    setRoomId(roomId);
    room__id = roomId;
    await initCall();
    socket.emit(
      "enter_room",
      {
        roomId: roomId,
        username: user.userData.name,
        image: user.userData.image,
        roomtype: VIDEO_CALL,
      },
      (usernickname, image) => {
        message.success("채팅방에 입장하셨습니다.");
        socket.emit("publicRooms", VIDEO_CALL);
      }
    );
  };

  async function getCameras(st) {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      //유저의 모든 장치정보들을 얻는다. 모니터 스피커 등등 다가져옴.
      //video input이 곧 유저의 카메라정보이다.
      console.log("devices : ", devices);
      const cameras = devices.filter((device) => device.kind === "videoinput");
      //유저 장치정보에서 카메라만 추출해온다.

      const currentCamera = st.getVideoTracks()[0]; //현재 카메라 정보를 얻어온다.

      //카메라가 여러개 추출되어있을수가있음.
      cameras.forEach((camera) => {
        setCameraOptions((cameraOptions) => [
          ...cameraOptions,
          {
            value: camera.deviceId,
            label: camera.label,
            selected: currentCamera.label === camera.label,
          },
        ]);
      });
    } catch (e) {
      console.log(e);
    }
  }

  //유저의 카메라, 오디오 정보를 가져와서 화면에 노출시키기.
  async function getMedia(deviceId) {
    const initialConstrains = {
      audio: true,
      video: { facingMode: "user" },
    };

    const cameraConstrains = {
      audio: true,
      video: {
        deviceId: { exact: deviceId },
      },
    };
    try {
      //유저의 카메라와 오디오를 (그걸 미디어라고 함)가져오기.
      const st = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstrains : initialConstrains
      );
      // setMyStream(st);
      console.log(myVideoRef);
      myStream = st;
      myVideoRef.current.srcObject = st;
      if (!deviceId) {
        await getCameras(st);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function handleCameraClick() {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    if (cameraOff) {
      setCameraOff(false);
    } else {
      setCameraOff(true);
    }
  }
  function handleMuteClick() {
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    //새로운 오디오값 지정하는거. 활성화할지 비활성화 할지.
    if (!muted) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  }

  function makeConnection() {
    console.log("make connection");
    try {
      myPeerConnection.current = new RTCPeerConnection({
        iceServers: [
          { urls: ["stun:ntk-turn-2.xirsys.com"] },
          {
            username:
              "NqYeMxsAmieGSyZeLyrujM9DvAssQ4xfE-s2folQuisY1R4LWXej0dEoqdsxehshAAAAAGLnl2lnZW5lcmFsY2hhbmc=",
            credential: "20c7bade-1179-11ed-bca8-0242ac120004",
            urls: [
              "turn:ntk-turn-2.xirsys.com:80?transport=udp",
              "turn:ntk-turn-2.xirsys.com:3478?transport=udp",
              "turn:ntk-turn-2.xirsys.com:80?transport=tcp",
              "turn:ntk-turn-2.xirsys.com:3478?transport=tcp",
              "turns:ntk-turn-2.xirsys.com:443?transport=tcp",
              "turns:ntk-turn-2.xirsys.com:5349?transport=tcp",
            ],
          },
        ],
      });

      myPeerConnection.current.addEventListener("icecandidate", handleIce);
      myPeerConnection.current.addEventListener("addstream", handleAddstream);
      // myPeerConnection.current.addEventListener("track", handleTrack);

      myStream.getTracks().forEach((track) => {
        myPeerConnection.current.addTrack(track, myStream);

        //영상과 영상 내 오디오를 p2p connection안에 삽입.
      });
    } catch (e) {
      console.log(e);
    }
  }

  function handleTrack(data) {
    console.log("data : ", data);
    peerFace.current.srcObject = data.streams[0];
  }

  function handleIce(data) {
    console.log("sent candidate : ", data);
    console.log("handleice시 roomId : ", room__id);
    socket.emit("ice", data.candidate, room__id);
  }

  function handleAddstream(data) {
    //여기서 data : 상대 브라우저의 스트림 정보. 자 이제 화상통화 진짜 가능.
    console.log("상대방 데이타 : ", data);
    peerFace.current.srcObject = data.stream;
  }
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
          <Col lg={12} xs={24}>
            <div>
              <video
                autoPlay
                playsInline
                ref={myVideoRef}
                style={{ width: "90%" }}
              ></video>

              <select>
                {/* */}
                {cameraOptions.map((cameraOption, index) => {
                  return (
                    <option
                      value={cameraOption.value}
                      selected={cameraOption.selected}
                    >
                      {cameraOption.label}
                    </option>
                  );
                })}
              </select>
              <Button
                type="default"
                size="large"
                onClick={handleCameraClick}
                shape="round"
              >
                {cameraOff === true ? "Turn on Camera" : "Turn off Camera"}
              </Button>
              <Button
                type="default"
                size="large"
                onClick={handleMuteClick}
                shape="round"
              >
                {muted === false ? "muted" : "unmuted"}
              </Button>
            </div>
          </Col>
          <Col lg={12} xs={24}>
            <div>
              <video
                autoPlay
                playsInline
                ref={peerFace}
                style={{ width: "90%" }}
              ></video>
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

export default CallChatPage;
