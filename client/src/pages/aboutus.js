import React, { Component } from "react";
import "../css/aboutus.css";

class aboutus extends Component {
  render() {
    return (
      <div>
        <div>
          {/* <p id="body-parag"> Discover Our Story </p>{" "} */}
          <section id="about-section">
            <div className="about-content">
              <h2> Who We Are: </h2>{" "}
              <p>
              Smart Pantry is a revolutionary food management solution designed to help households, restaurants, and food retailers keep track of their pantry stocks in an efficient and seamless manner. Our goal is to simplify food inventory management, reduce food waste, and ensure that food is consumed in the most sustainable way possible.

With the help of cutting-edge technologies such as image recognition and real-time inventory updates, Smart Pantry offers an intuitive platform that helps users keep track of food items, expiration dates, and quantities. Whether you're at home, at work, or on the go, Smart Pantry ensures you have full visibility and control over your food supplies.{" "}
              </p>{" "}
            </div>{" "}
            <div className="about-content">
              <h2> Our Mission </h2>{" "}
              <p>
              At Smart Pantry, our mission is to empower users to make smarter, more informed decisions about their food consumption. We believe in reducing food waste, increasing sustainability, and saving time for busy households and businesses. By providing a smart and efficient way to manage food stocks, we aim to create a future where food management is no longer a hassle, but a breeze.{" "}
              </p>{" "}
            </div>{" "}
            <div className="about-content">
              <h2> What We Offer: </h2>{" "}
              <p>
                
              Track Inventory: Easily track your food items by scanning barcodes, uploading images, or manually adding them into the system.

Expiration Alerts: Get notified when your food items are nearing their expiration date so you can plan meals or discard items in time.

Automated Stock Updates: Automatically update your pantry’s stock with new purchases, ensuring you're always aware of what’s available.

Waste Reduction: With our intuitive features, we help reduce food waste by providing suggestions on how to use up ingredients before they expire and letting you know when to buy new items.{" "}
              </p>{" "}
            </div>{" "}
          </section>{" "}
        </div>{" "}
      </div>
    );
  }
}

export default aboutus;
