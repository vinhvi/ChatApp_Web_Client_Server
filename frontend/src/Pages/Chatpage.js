import { Box } from "@chakra-ui/layout";
import { useEffect, useState, useContext } from "react";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState, ChatContext } from "../Context/ChatProvider";
import { useHistory } from "react-router-dom";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000"; // socket den
var socket;
const Chatpage = () => {
  // dùng trong ChatBox
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [fetchAgain, setFetchAgain] = useState(false);
  const history = useHistory();
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    if (user == null) {
      history.go(0);
    }
  }, [history]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true)); // client nhận được rồi mơi save dô client
    
    console.log("SINGLE CHAT:", socket);
  }, []);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && 
        <MyChats 
        fetchAgain={fetchAgain} 
        socket={socket}
        />}
        {user && (
          <Chatbox 
          fetchAgain={fetchAgain} 
          setFetchAgain={setFetchAgain} 
          socket={socket}
          socketConnected ={socketConnected}
          />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
