import { Link } from "react-router-dom";
import { BsCardChecklist } from "react-icons/bs";
import { RiUserSettingsLine } from "react-icons/ri";
import "../sass/Navbar.scss";

export default function Navbar() {
  return (
    <nav className="Navbar">
      <ul className="Navbar_list">
        <li className="Navbar_list_item">
          <Link to={"/todoLists"}>{<BsCardChecklist />}</Link>
        </li>
        <li className="Navbar_list_item">
          <Link to={"/"}>FIX IT✓</Link>
        </li>
        <li className="Navbar_list_item">
          <Link to={"/userSettings"}>{<RiUserSettingsLine />}</Link>
        </li>
      </ul>
    </nav>
  );
}
