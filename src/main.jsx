import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#dfa727",
      },
      components: {
        Modal: {
          contentBg: "#212121",
        },
        Typography: {
          colorText: "#fff",
          colorTextHeading: "#fff",
        },
      },
    }}
  >
    <App />
  </ConfigProvider>,
);
