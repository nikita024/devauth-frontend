import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <Link to="/dashboard">
          <li>
            Home
          </li>
        </Link>
       <Link to="/Profile">
          <li>
            Profiles
        </li>
        </Link>
        
          <Link to="/about">
          <li>
            About
        </li>
        </Link>

       
          <Link to="/contact">
          <li>
            Contact
        </li>
       </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
