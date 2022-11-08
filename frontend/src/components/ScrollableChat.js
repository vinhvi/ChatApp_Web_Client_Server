import ScrollableFeed from "react-scrollable-feed";
import BoxMessage from "./miscellaneous/BoxMessage";
import { Box, Text } from "@chakra-ui/layout";

const ScrollableChat = ({ messages, socket }) => {


  return (
    <>
      <ScrollableFeed>
      

        {messages &&
          messages.map((m, i) => (
            <BoxMessage messages={messages} m={m} i={i} socket={socket} />
          ))}
      </ScrollableFeed>
    </>
  );
};

export default ScrollableChat;
