import React from "react";
import { Carousel, Row, Col, Image } from "antd";
import "../../styles/Slider.css"; // Import your CSS file here

const imageLinks = [
  "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738487510/%E5%AE%983333jpg-02_1_vnz9fn.jpg",
  "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738487510/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20241010085643_adwg4x.jpg",
  "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738487509/1733381927cGgS5_suhrw2.jpg",
  "https://res.cloudinary.com/dfvgxf4dc/image/upload/v1738487509/cms_2Foriginal-776e3197-8b86-4a6a-af59-394b86b451b1_tuctrq.webp"
];

const App: React.FC = () => (
  <Carousel dots autoplay draggable={true} className="custom-carousel">
    {imageLinks.map((link, index) => (
      <div key={index}>
        <Row justify="center" align="middle" gutter={[16, 16]} className="carousel-slide">
          <Col xs={24} md={12}>
            <Image
              className="carousel-image"
              preview={false}
              src={link}
            />
          </Col>
        </Row>
      </div>
    ))}
  </Carousel>
);

export default App;
