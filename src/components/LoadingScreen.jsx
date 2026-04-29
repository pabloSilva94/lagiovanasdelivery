import Lottie from "lottie-react";
import loadingAnimation from "../assets/lp.json";

export const LoadingScreen = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#121212",
      }}
    >
      <div style={{ width: 400 }}>
        <Lottie animationData={loadingAnimation} />
      </div>
    </div>
  );
};
