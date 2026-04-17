import {
  Card,
  Badge,
  Typography,
  Button,
  Flex,
  Avatar,
  Modal,
  App as AntdApp,
} from "antd";
import "./App.css";
import { FiMapPin } from "react-icons/fi";
import { BsShop } from "react-icons/bs";
import { AiFillFacebook, AiFillInstagram } from "react-icons/ai";
import { FaTiktok } from "react-icons/fa";
import { MdDeliveryDining } from "react-icons/md";
import { useEffect, useState } from "react";
import { getUserLocation, getDistance } from "./func/getUserLocation";
import Logo from "./assets/logo.webp";
import Location from "./assets/location.webp";
import { socialMedia, stores, TitleStore } from "./func/stores";

function App() {
  const { message } = AntdApp.useApp();
  const { Text, Title } = Typography;

  const [city, setCity] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedStores, setSortedStores] = useState(stores);

  const handleGetCity = async () => {
    try {
      const getCity = await getUserLocation();

      if (!getCity?.data) {
        return message.warning(
          "Localização não disponível 😥, mas mostramos primeiro nossas novidades!"
        );
      }

      const { latitude, longitude } = getCity.data;

      const ordered = [...stores].sort((a, b) => {
        const distA = getDistance(latitude, longitude, a.coords.lat, a.coords.lon);
        const distB = getDistance(latitude, longitude, b.coords.lat, b.coords.lon);
        return distA - distB;
      });

      setSortedStores(ordered);

      const formatted = await transformCity(getCity.data);
      if (formatted) {
        setCity(formatted);
        localStorage.setItem("userCity", formatted);
      }
    } catch {
      const orderedByNew = [...stores].sort((a, b) =>
        a.novidade === b.novidade ? 0 : a.novidade ? -1 : 1
      );

      setSortedStores(orderedByNew);

      message.info(
        "Você recusou a localização 😥, mas mostramos primeiro nossas novidades!"
      );
    }
  };

  const transformCity = async (pos) => {
    const { latitude: lat, longitude: lon } = pos || {};
    if (!lat || !lon) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );

      if (!response.ok) return;

      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.village;
      const uf = data.address["ISO3166-2-lvl4"]?.replace("BR-", "") || data.address.state;

      return city && uf ? `${city} - ${uf}` : city || "Cidade não encontrada";
    } catch {
      return;
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("firstVisit")) {
      setIsModalOpen(true);
      localStorage.setItem("firstVisit", "true");
    }
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = "assets/bg.webp";
    img.onload = () => {
      document.querySelector(".bgCover").style.backgroundImage = "url('assets/bg.webp')";
    };
  }, []);

  return (
    <div className="container">
      <Modal open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} centered>
        <Flex vertical gap={10} align="center" style={{ textAlign: "center" }}>
          <img src={Logo} alt="Logo" style={{ height: 150 }} />
          <Title level={4}>Bem-vindo à {TitleStore} 🍕</Title>
          <Text strong>
            Queremos te mostrar a {TitleStore} mais próxima. Para isso, precisamos da sua autorização de localização.
          </Text>
          <img src={Location} alt="localização" style={{ borderRadius: 10 }} />
          <Button
            type="primary"
            onClick={() => {
              setIsModalOpen(false);
              handleGetCity();
            }}
            icon={<FiMapPin />}
          >
            Permitir localização
          </Button>
        </Flex>
      </Modal>

      <div className="bgCover" />
      <header>
        <img src={Logo} alt="logo" />
      </header>

      <div className="main2">
        {sortedStores.map((store, index) => {
          const cardContent = (
            <Card
              key={index}
              styles={{
                header: { padding: "0px 10px" },
                body: { padding: "30px 10px" },
                title: { fontSize: 20, fontWeight: "bold" },
              }}
              title={<><BsShop color={store.colorPrimary} /> {store.name}</>}
              className="card"
            >
              <Card.Meta
                description={
                  <div className="descriCard">
                    {store.address ? (
                      <a href={store.maps} style={{ textDecoration: "none", color: "#929292" }} className="local">
                        <FiMapPin color={store.colorPrimary} className="endereco" />
                        {store.address}
                      </a>
                    ) : (
                      <Text style={{ color: "#929292" }} strong>
                        Estamos no delivery, clique abaixo para conferir nosso cardápio!
                      </Text>
                    )}
                    <Button href={store.link} className="link" icon={<MdDeliveryDining size={20} />} type="primary">
                      <Text strong style={{ color: "#fff" }}>Pedir agora</Text>
                    </Button>
                  </div>
                }
              />
            </Card>
          );

          return store.novidade ? (
            <Badge.Ribbon key={index} text="Novidade" color="gold">
              {cardContent}
            </Badge.Ribbon>
          ) : (
            cardContent
          );
        })}

        <Flex gap={10}>
          <Avatar
            icon={<AiFillInstagram color="#fff" />}
            size="large"
            style={{ background: sortedStores[0].colorPrimary, cursor: "pointer" }}
            onClick={() => window.open(socialMedia.instagram, "_blank")}
          />
          <Avatar
            icon={<FaTiktok color="#fff" />}
            size="large"
            style={{ background: sortedStores[0].colorPrimary, cursor: "pointer" }}
            onClick={() => window.open(socialMedia.tiktok, "_blank")}
          />
          <Avatar
            icon={<AiFillFacebook color="#fff" />}
            size="large"
            style={{ background: sortedStores[0].colorPrimary, cursor: "pointer" }}
            onClick={() => window.open(socialMedia.facebook, "_blank")}
          />
        </Flex>
      </div>
    </div>
  );
}

export default App;
