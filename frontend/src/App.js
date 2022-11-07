import "./App.css";
import Homepage from "./Pages/Homepage";
import { Route } from "react-router-dom";
import Chatpage from "./Pages/Chatpage";

function App() {
  return (
    <div className="App">
      {/* exact: 2 route sẽ đụng nhau, do cùng path nên thêm keyword -> khỏi đụn */}
      <Route path="/" component={Homepage} exact />
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;
