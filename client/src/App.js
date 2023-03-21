import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./sass/App.scss";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import TodoLists from "./pages/TodoLists";
import Tasks from "./pages/Tasks";
import UserSetting from "./pages/UserSettings";
import Register from "./pages/Register";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/todoLists" element={<TodoLists />} />
        <Route path="/userSettings" element={<UserSetting />} />
        <Route path="/task/:todoListName/:username" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
