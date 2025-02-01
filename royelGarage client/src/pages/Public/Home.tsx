import React from "react";
import { Carousel, Flex, Image } from "antd";

const contentStyle: React.CSSProperties = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#364d79",
};

const App: React.FC = () => (
  <Carousel dots autoplay draggable={true}>
    <Flex >
      <div>
      <Image
    
       preview={false}
      src="https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738348154/1733381927cGgS5_wyrbb1.jpg" />
      </div>
      <div>
      <h4>Sport Racing</h4>
      <h1>300SR</h1>
      <h4>
        The CFMOTO 300SR is a sleek 298cc sports bike with superior handling,
        aerodynamic design, and a responsive engine for thrilling rides.
      </h4>
      </div>
    </Flex>
    <div>
      <Image 
       preview={false}
      src="https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738348154/1737004310xzf55_td4nd4.avif" />
    </div>
    <div>
      <Image
       preview={false}
      src="https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738348153/1733155847hjgQg_ykhbah.avif" />
    </div>
    <div>
      <Image
       preview={false}
      src="https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738348153/1733155823sQYEX_tdpexr.avif" />
    </div>
  </Carousel>
);

export default App;
