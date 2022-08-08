import Navbar from "./Navbar";
import Footer from "./Footer";
import { colors } from "../../styles/colors.js";

const Layout = ({ children }) => {
  return (
    <div
      className="content"
      style={{ backgroundColor: colors.blueMunsellPale }}
    >
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
