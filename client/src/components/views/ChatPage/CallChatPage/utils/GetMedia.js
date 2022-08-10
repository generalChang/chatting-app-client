import React from "react";
import { withRouter } from "react-router-dom";




function GetMedia(props) {
    const initialConstrains = {
        audio: true,
        video: { facingMode: "user" },
      };
    
      const cameraConstrains = {
        audio: true,
        video: {
          deviceId: { exact: props.deviceId },
        },
      };
      try {
        //유저의 카메라와 오디오를 (그걸 미디어라고 함)가져오기.
        props.updateStream(await navigator.mediaDevices.getUserMedia(
            props.deviceId ? cameraConstrains : initialConstrains
          ))
       
    
        if (!props.deviceId) {
          await getCameras();
        }
      } catch (e) {
        console.log(e);
      }
    
  
  return <div></div>;
}

export default withRouter(GetMedia);
