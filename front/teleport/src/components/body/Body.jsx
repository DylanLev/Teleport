import React from 'react';
import './Body.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css/bundle';
import { images } from '../../assets/images.js';
import Mailbox from '../mailbox/Mailbox.jsx';

const Body = () => {
  return (
    <div className="body-container">
      <div className="swiper-container">
        <Swiper
          modules={[Autoplay, Pagination]}
          loop={true}
          autoplay={{ delay: 12000 }}
          className="swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <img src={image} alt={`Slide ${index + 1}`} />
              <div className="dark-overlay" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="content-overlay">
        <div className="left">
          <h1>🌍 Teleport: Your Travel Companion</h1>
          <p>
            Explore the world, immerse in local culture, and stay informed with Teleport - your all-in-one AI travel assistant!
          </p>
          <h2>🗣️ Master the Local Language</h2>
          <ul>
            <li>Learn essential phrases and vocabulary with our AI language tutor</li>
            <li>Practice pronunciation with real-time feedback</li>
            <li>Engage in simulated conversations with AI-generated locals</li>
          </ul>
          <h2>🏙️ Real-Time Local Insights</h2>
          <ul>
            <li>Get instant information about attractions, restaurants, and hidden gems</li>
            <li>Access AI-generated walking tours tailored to your interests</li>
            <li>Receive live updates on weather, transportation, and local events</li>
          </ul>
          <h2>📰 Stay Updated with Local Trends</h2>
          <ul>
            <li>Receive curated, real-time news from local sources</li>
            <li>Understand cultural context with AI-powered explanations</li>
            <li>Discover trending topics and events in your destination</li>
          </ul>
          <p><strong>Teleport - Experience the world like never before!</strong></p>
        </div>
        <div className="right">
          <Mailbox />
        </div>
      </div>
      
    </div>
  );
}

export default Body;