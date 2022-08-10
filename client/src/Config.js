export const API_URL = "https://sukka-server.herokuapp.com";
export const Gender = [
  {
    value: 1,
    label: "Man",
  },
  {
    value: 2,
    label: "Woman",
  },
];

export const ChatCategory = [
  {
    name: "그룹채팅",
    label: "groupChat",
    description:
      "여러명이 함께 즐길 수 있는 그룹 채팅방에 입장합니다. 사람들과 가벼운 잡담부터 무거운 이야기까지 나눠보세요.",
    imageUrl: "http://localhost:5000/uploads/chat/group-chat.png",
  },
  {
    name: "1대1 화상채팅",
    label: "callChat",
    description:
      "상대방과 서로의 얼굴을 보면서 통화를 할 수 있습니다. 이성친구를 사귀기 좋지 않을까요?",
    imageUrl: "http://localhost:5000/uploads/chat/call-chat.png",
  },
  {
    name: "랜덤채팅",
    label: "randomChat",
    description:
      "낯선사람과 무작위로 매칭이 이루어집니다. 연령대와 성별을 초월한 만남을 가져보세요.",
    imageUrl: "http://localhost:5000/uploads/chat/random-chat.png",
  },
];
