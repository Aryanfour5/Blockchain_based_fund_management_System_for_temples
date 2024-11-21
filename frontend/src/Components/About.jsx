import React from 'react';
import './About.css'; // Ensure this file contains the styles below

const About = () => {
  return (
    <div className="container">
      <h1>Trust Members</h1>
      <table className="trust-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Contact No</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mr Ketan Kotecha</td>
            <td>Chief Trustee</td>
            <td>9421137784</td>
          </tr>
          <tr>
            <td>Dr Amol Dhumane</td>
            <td>Treasurer</td>
            <td>9423291028</td>
          </tr>
          <tr>
            <td>Ms Shwetambari Chiwhane</td>
            <td>Treasurer</td>
            <td>9422432776</td>
          </tr>
          <tr>
            <td>Mr. Hriday Thaker</td>
            <td>Trustee</td>
            <td>9422595565</td>
          </tr>
          <tr>
            <td>Mr Omkar Darekar</td>
            <td>Secretary</td>
            <td>9422051503</td>
          </tr>
          <tr>
            <td>Mr Aryan Bachute</td>
            <td>Trustee</td>
            <td>9421233708</td>
          </tr>
          <tr>
            <td>Ms Ayushi Mahajan</td>
            <td>Trustee</td>
            <td>9423805262</td>
          </tr>
        </tbody>
      </table>

      <h1>About this Temple</h1>
      <p>
        Ganpatipule is one of the "Ashta Dwar Devatas" (Eight Welcoming Deities) of the subcontinent 
        and is known as the Western Sentinel God. During the reign of the Mughals (about 1600 years ago), 
        there was a 'Kevada' (Flower tree) jungle at the foot of the hill where the temple of 'Swayambhu' 
        Ganapati is presently situated. Here lived Balbhatji Bhide, a Brahmin, who was the renter of the 
        village. During the Mughal period, Bhide encountered a major personal problem and decided to give 
        up food and water until being relieved of the personal calamity. He stayed in the Kevada jungle 
        for penance and worshipped his tutelar deity 'Mangalmurti' (Lord Ganesh).
      </p>
    </div>
  );
};

export default About;
