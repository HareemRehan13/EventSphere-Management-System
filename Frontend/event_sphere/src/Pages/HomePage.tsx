import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeVenueTab, setActiveVenueTab] = useState('overview');
  const [activeDay, setActiveDay] = useState('day1');
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('home');

  const carouselImages = [
    'https://images.pexels.com/photos/13834522/pexels-photo-13834522.jpeg',
    'https://images.pexels.com/photos/12876490/pexels-photo-12876490.jpeg',
    'https://images.pexels.com/photos/7648306/pexels-photo-7648306.jpeg'
  ];

  const venueImages = [
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop'
  ];

  const galleryLinks = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop',
    'https://themewagon.github.io/theevent/assets/img/venue-gallery/venue-gallery-1.jpg',
    'https://themewagon.github.io/theevent/assets/img/venue-gallery/venue-gallery-3.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Update active nav based on scroll position
      const sections = ['home', 'about', 'speakers', 'schedule', 'venue', 'gallery', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveNav(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveNav(sectionId);
    }
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif", backgroundColor: '#fff', color: '#060c22' }}>
      {/* CSS Links */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />

      {/* Navigation */}
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-logo" onClick={() => scrollToSection('home')}>
          <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" alt="logo" />
          <h2>EVENT<span>SPHERE</span></h2>
        </div>
        <ul>
          <li 
            className={activeNav === 'home' ? 'active' : ''} 
            onClick={() => scrollToSection('home')}
          >
            Home
          </li>
          <li 
            className={activeNav === 'about' ? 'active' : ''} 
            onClick={() => scrollToSection('about')}
          >
            About
          </li>
          <li 
            className={activeNav === 'speakers' ? 'active' : ''} 
            onClick={() => scrollToSection('speakers')}
          >
            Speakers
          </li>
          <li 
            className={activeNav === 'schedule' ? 'active' : ''} 
            onClick={() => scrollToSection('schedule')}
          >
            Schedule
          </li>
          <li 
            className={activeNav === 'venue' ? 'active' : ''} 
            onClick={() => scrollToSection('venue')}
          >
            Venue
          </li>
          <li 
            className={activeNav === 'gallery' ? 'active' : ''} 
            onClick={() => scrollToSection('gallery')}
          >
            Gallery
          </li>
          <li 
            className={activeNav === 'contact' ? 'active' : ''} 
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </li>
        </ul>
        <button className="btn-login" onClick={() => navigate('/login')}>Login</button>
      </nav>

      {/* Hero Section */}
      <section id="home">
        <div className="carousel-content">
          <h1>THE EVENT <span>SPHERE</span></h1>
          <p>10-12 August, Aptech North Nazimabad Center, Karachi</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="section-header">
          <h2>About <span>The Event</span></h2>
          <p>Pakistan's premier tech conference bringing together industry leaders and aspiring professionals for three days of innovation, networking, and learning.</p>
        </div>
        <div className="about-container">
          <div className="about-box">
            <i className="fas fa-map-marker-alt"></i>
            <h3>WHERE</h3>
            <p>Aptech North Nazimabad Center, ST-4/A, Block 7, Near Civic Center, Karachi</p>
          </div>
          <div className="about-box">
            <i className="far fa-calendar-alt"></i>
            <h3>WHEN</h3>
            <p>Friday to Sunday<br />10-12 August 2025</p>
          </div>
        </div>
      </section>

      {/* Speakers Section */}
      <section id="speakers" className="section">
        <div className="section-header">
          <h2>Event <span>Speakers</span></h2>
          <p>Here are some of our speakers</p>
        </div>
        <div className="speakers-grid">
          <div className="speaker-card">
            <div className="speaker-img-container">
              <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop" 
                alt="Fizza Bashir" 
                className="speaker-img"
              />
            </div>
            <h3 className="speaker-name">Fizza Bashir</h3>
            <p className="speaker-title">Senior AI Researcher at TechKarachi</p>
            <p className="speaker-bio">Expert in machine learning and artificial intelligence with 10+ years of industry experience.</p>
            <div className="speaker-social">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
            </div>
          </div>
          <div className="speaker-card">
            <div className="speaker-img-container">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&auto=format&fit=crop" 
                alt="Alishba Hashmi" 
                className="speaker-img"
              />
            </div>
            <h3 className="speaker-name">Alishba Hashmi</h3>
            <p className="speaker-title">Lead UX Designer at DesignHub PK</p>
            <p className="speaker-bio">Specializing in user-centered design with a focus on accessibility and inclusivity.</p>
            <div className="speaker-social">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-dribbble"></i></a>
            </div>
          </div>
          <div className="speaker-card">
            <div className="speaker-img-container">
              <img 
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop" 
                alt="Fareeha Parvaiz" 
                className="speaker-img"
              />
            </div>
            <h3 className="speaker-name">Fareeha Parvaiz</h3>
            <p className="speaker-title">CEO at PakTech Ventures</p>
            <p className="speaker-bio">Entrepreneur and investor focused on growing Pakistan's tech ecosystem.</p>
            <div className="speaker-social">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-medium"></i></a>
            </div>
          </div>
          <div className="speaker-card">
            <div className="speaker-img-container">
              <img 
                src="https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=800&auto=format&fit=crop" 
                alt="Marfia Rani" 
                className="speaker-img"
              />
            </div>
            <h3 className="speaker-name">Marfia Rani</h3>
            <p className="speaker-title">Blockchain Expert at CryptoPak</p>
            <p className="speaker-bio">Leading blockchain developer with expertise in decentralized applications and smart contracts.</p>
            <div className="speaker-social">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-ethereum"></i></a>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="section">
        <div className="section-header">
          <h2>Event <span>Schedule</span></h2>
          <p>Here is our event schedule</p>
        </div>
        <div className="schedule-container">
          <div className="schedule-nav">
            <button 
              className={activeDay === 'day1' ? 'active' : ''}
              onClick={() => setActiveDay('day1')}
            >
              Day 1
            </button>
            <button 
              className={activeDay === 'day2' ? 'active' : ''}
              onClick={() => setActiveDay('day2')}
            >
              Day 2
            </button>
            <button 
              className={activeDay === 'day3' ? 'active' : ''}
              onClick={() => setActiveDay('day3')}
            >
              Day 3
            </button>
          </div>
          <div className={`schedule-day ${activeDay === 'day1' ? 'active' : ''}`}>
            <h3><i className="far fa-calendar-alt"></i> August 10, 2025</h3>
            <div className="schedule-item">
              <div className="schedule-time">08:00 AM</div>
              <div className="schedule-details">
                <h4>Registration & Welcome Breakfast</h4>
                <p>Main Hall</p>
                <p className="speaker-name">Host: EventSphere Team</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">09:30 AM</div>
              <div className="schedule-details">
                <h4>Opening Ceremony</h4>
                <p>Main Auditorium</p>
                <p className="speaker-name">Speaker: Fizza Bashir</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">11:00 AM</div>
              <div className="schedule-details">
                <h4>Keynote: Future of AI in Pakistan</h4>
                <p>Main Auditorium</p>
                <p className="speaker-name">Speaker: Dr. Ali Khan</p>
              </div>
            </div>
          </div>
          <div className={`schedule-day day2 ${activeDay === 'day2' ? 'active' : ''}`}>
            <h3><i className="far fa-calendar-alt"></i> August 11, 2025</h3>
            <div className="schedule-item">
              <div className="schedule-time">09:00 AM</div>
              <div className="schedule-details">
                <h4>Workshop: Web Development Fundamentals</h4>
                <p>Tech Lab 1</p>
                <p className="speaker-name">Instructor: Sarah Ahmed</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">11:00 AM</div>
              <div className="schedule-details">
                <h4>Panel Discussion: Women in Tech</h4>
                <p>Main Auditorium</p>
                <p className="speaker-name">Moderator: Alishba Hashmi</p>
              </div>
            </div>
          </div>
          <div className={`schedule-day day3 ${activeDay === 'day3' ? 'active' : ''}`}>
            <h3><i className="far fa-calendar-alt"></i> August 12, 2025</h3>
            <div className="schedule-item">
              <div className="schedule-time">10:00 AM</div>
              <div className="schedule-details">
                <h4>Closing Keynote: The Next Decade of Tech</h4>
                <p>Main Auditorium</p>
                <p className="speaker-name">Speaker: Fareeha Parvaiz</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="schedule-time">12:00 PM</div>
              <div className="schedule-details">
                <h4>Awards Ceremony & Closing Remarks</h4>
                <p>Main Hall</p>
                <p className="speaker-name">Host: EventSphere Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Section */}
      <section id="venue" className="section">
        <div className="section-header">
          <h2>Event <span>Venue</span></h2>
          <p>Our event location</p>
        </div>
        <div className="venue-content">
          <div className="venue-text">
            <div className="venue-tabs">
              <div 
                className={`venue-tab ${activeVenueTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveVenueTab('overview')}
              >
                Overview
              </div>
              <div 
                className={`venue-tab ${activeVenueTab === 'facilities' ? 'active' : ''}`}
                onClick={() => setActiveVenueTab('facilities')}
              >
                Facilities
              </div>
              <div 
                className={`venue-tab ${activeVenueTab === 'location' ? 'active' : ''}`}
                onClick={() => setActiveVenueTab('location')}
              >
                Location
              </div>
            </div>
            
            {activeVenueTab === 'overview' && (
              <div className="venue-description">
                <p>Aptech North Nazimabad Center is Karachi's premier technology education hub, featuring state-of-the-art facilities perfect for large-scale tech events. The venue boasts a 500-seat auditorium, multiple breakout rooms, and high-speed internet throughout.</p>
                <p>Recently renovated in 2024, the center combines modern architectural design with cutting-edge technology infrastructure, making it the ideal location for EventSphere 2025.</p>
              </div>
            )}
            
            {activeVenueTab === 'facilities' && (
              <div className="venue-description">
                <p><strong>Main Auditorium:</strong> 500 capacity with Dolby surround sound and 4K projection</p>
                <p><strong>Breakout Rooms:</strong> 8 fully-equipped meeting rooms (20-50 capacity each)</p>
                <p><strong>Networking Lounge:</strong> Spacious area with comfortable seating</p>
                <p><strong>Tech Lab:</strong> 50 workstations for hands-on workshops</p>
                <p><strong>Catering:</strong> On-site café and dining area</p>
              </div>
            )}
            
            {activeVenueTab === 'location' && (
              <div className="venue-description">
                <p><strong>Address:</strong> ST-4/A, Block 7, Near Civic Center, North Nazimabad, Karachi</p>
                <p><strong>Parking:</strong> Secure underground parking available (200+ spaces)</p>
                <p><strong>Public Transport:</strong> 5-minute walk from Nazimabad Metro Station</p>
                <p><strong>Accessibility:</strong> Wheelchair accessible with dedicated facilities</p>
              </div>
            )}
          </div>
          
          <div className="venue-map-container">
            <div className="venue-map">
              <img 
                src="https://themewagon.github.io/theevent/assets/img/venue-gallery/venue-gallery-5.jpg" 
                alt="Venue Location Map"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: 20,
                left: 20,
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                padding: '15px',
                borderRadius: '5px'
              }}>
                <h3 style={{ marginBottom: '5px' }}>Aptech North Nazimabad</h3>
                <p>ST-4/A, Block 7, Near Civic Center</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="venue-images">
          {venueImages.map((img, index) => (
            <div key={index} className="venue-image">
              <img src={img} alt={`Venue ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section">
        <div className="section-header">
          <h2>Event <span>Gallery</span></h2>
          <p>Check our gallery from recent events</p>
        </div>
        <div className="gallery">
          {galleryLinks.map((src, i) => (
            <div key={i} className="gallery-item">
              <img src={src} alt={`Gallery ${i + 1}`} />
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="section-header">
          <h2><span>Contact</span> Us</h2>
          <p>Feel free to reach out to us</p>
        </div>
        <div className="contact-info">
          <p>Have questions about the event? Want to become a sponsor? Interested in speaking opportunities? Contact us using the information below or send us a message.</p>
          <div className="contact-details">
            <div className="contact-box">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>Location:</h4>
                <p>Aptech North Nazimabad, Karachi</p>
              </div>
            </div>
            <div className="contact-box">
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Email:</h4>
                <p>info@eventsphere.com</p>
              </div>
            </div>
            <div className="contact-box">
              <i className="fas fa-phone"></i>
              <div>
                <h4>Call:</h4>
                <p>+92 300 1234567</p>
              </div>
            </div>
          </div>
          <div className="social-links">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-col">
            <h4>EVENT<span>SPHERE</span></h4>
            <p>ST-4/A, Block 7, Near Civic Center<br />North Nazimabad, Karachi</p>
            <p><strong>Phone:</strong> +92 300 1234567</p>
            <p><strong>Email:</strong> info@eventsphere.com</p>
          </div>

          <div className="footer-col">
            <h4>Useful Links</h4>
            <ul className="footer-links">
              <li><a onClick={() => scrollToSection('home')}>Home</a></li>
              <li><a onClick={() => scrollToSection('about')}>About</a></li>
              <li><a onClick={() => scrollToSection('speakers')}>Speakers</a></li>
              <li><a onClick={() => scrollToSection('schedule')}>Schedule</a></li>
              <li><a onClick={() => scrollToSection('venue')}>Venue</a></li>
              <li><a onClick={() => scrollToSection('gallery')}>Gallery</a></li>
              <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Event Categories</h4>
            <ul className="footer-links">
              <li><a href="#">Tech Workshops</a></li>
              <li><a href="#">Keynote Speeches</a></li>
              <li><a href="#">Networking Sessions</a></li>
              <li><a href="#">Startup Pitches</a></li>
              <li><a href="#">Career Fair</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p>Subscribe to our newsletter to get updates about our upcoming events.</p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Your Email" />
              <button>Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; Copyright <strong>EventSphere</strong>. All Rights Reserved</p>
        </div>
      </footer>

      {/* CSS Styles */}
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        /* Navigation */
        .nav {
          background: rgba(6, 12, 34, 0.98);
          color: #fff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 100px;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .nav.scrolled {
          padding: 15px 100px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          background: rgba(0, 10, 40, 0.98);
        }
        
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        
        .nav-logo:hover {
          transform: scale(1.05);
        }
        
        .nav-logo img {
          height: 40px;
          transition: transform 0.3s ease;
        }
        
        .nav-logo:hover img {
          transform: rotate(-5deg);
        }
        
        .nav-logo h2 {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          margin: 0;
          transition: all 0.3s ease;
        }
        
        .nav-logo h2 span {
          color: #f82249;
        }
        
        .nav ul {
          display: flex;
          list-style: none;
          gap: 30px;
        }
        
        .nav li {
          cursor: pointer;
          position: relative;
          font-weight: 500;
          font-size: 15px;
          color: #fff;
          transition: all 0.3s ease;
          padding: 10px 0;
        }
        
        .nav li:hover {
          color: #f82249;
          transform: translateY(-3px);
        }
        
        .nav li.active {
          color: #f82249;
        }
        
        .nav li.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: #f82249;
          animation: underlineGrow 0.3s ease-out;
        }
        
        @keyframes underlineGrow {
          from { width: 0; }
          to { width: 100%; }
        }
        
        .btn-login {
          background: #f82249;
          color: white;
          border: none;
          padding: 10px 25px;
          border-radius: 50px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-size: 14px;
          letter-spacing: 1px;
          box-shadow: 0 2px 10px rgba(248, 34, 73, 0.3);
        }
        
        .btn-login:hover {
          background: #e61e42;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(248, 34, 73, 0.4);
        }
        
        /* Hero Section */
        #home {
          height: 100vh;
          min-height: 600px;
          background-image: url('${carouselImages[currentSlide]}');
          background-size: cover;
          background-position: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          transition: background-image 1s ease-in-out;
        }
        
        .carousel-content {
          position: relative;
          z-index: 2;
          color: #fff;
          max-width: 900px;
          padding: 0 20px;
          margin-top: 80px;
          animation: fadeInUp 1s ease-out;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(30px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        #home h1 {
          font-size: 64px;
          font-weight: 700;
          margin-bottom: 20px;
          text-transform: uppercase;
          line-height: 1.2;
          animation: textGlow 3s ease-in-out infinite alternate;
        }
        
        @keyframes textGlow {
          from {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          }
          to {
            text-shadow: 0 0 20px rgba(255, 255, 255, 1);
          }
        }
        
        #home h1 span {
          color: #f82249;
        }
        
        #home p {
          font-size: 24px;
          margin-bottom: 30px;
          font-weight: 300;
          animation: fadeIn 1.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        /* Section Styling */
        .section {
          padding: 120px 0;
          position: relative;
          overflow: hidden;
        }
        
        .section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(6, 12, 34, 0.05) 0%, rgba(248, 34, 73, 0.05) 100%);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.5s ease;
        }
        
        .section:hover::before {
          opacity: 1;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }
        
        .section-header h2 {
          font-size: 36px;
          font-weight: 700;
          color: #060c22;
          margin-bottom: 15px;
          text-transform: uppercase;
          position: relative;
          padding-bottom: 15px;
          display: inline-block;
        }
        
        .section-header h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 2px;
          background: #f82249;
          transition: width 0.3s ease;
        }
        
        .section-header:hover h2::after {
          width: 120px;
        }
        
        .section-header p {
          color: #777;
          font-size: 18px;
          max-width: 800px;
          margin: 0 auto;
          transition: all 0.3s ease;
        }
        
        .section-header:hover p {
          color: #555;
        }
        
        .section-header span {
          color: #f82249;
        }
        
        /* About Section */
        #about {
          background: #fff;
        }
        
        .about-container {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .about-box {
          flex: 1;
          min-width: 300px;
          background: #f8f9fa;
          padding: 40px 30px;
          border-radius: 10px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }
        
        .about-box::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: #f82249;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }
        
        .about-box:hover::before {
          transform: scaleX(1);
        }
        
        .about-box:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        
        .about-box i {
          font-size: 48px;
          color: #f82249;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        
        .about-box:hover i {
          transform: rotate(15deg) scale(1.1);
        }
        
        .about-box h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 15px;
          color: #060c22;
          transition: all 0.3s ease;
        }
        
        .about-box:hover h3 {
          color: #f82249;
        }
        
        .about-box p {
          color: #6c757d;
          font-size: 16px;
          line-height: 1.6;
          transition: all 0.3s ease;
        }
        
        .about-box:hover p {
          color: #495057;
        }
        
        /* Speakers Section */
        #speakers {
          background: #f8f9fa;
        }
        
        .speakers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 30px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .speaker-card {
          background: #fff;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
        }
        
        .speaker-card::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          background: #f82249;
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        
        .speaker-card:hover::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        
        .speaker-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        
        .speaker-img-container {
          width: 180px;
          height: 180px;
          margin: 0 auto 20px;
          border-radius: 50%;
          overflow: hidden;
          border: 5px solid #f8f9fa;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .speaker-card:hover .speaker-img-container {
          border-color: #f82249;
          transform: scale(1.05);
        }
        
        .speaker-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.5s ease;
        }
        
        .speaker-card:hover .speaker-img {
          transform: scale(1.1);
        }
        
        .speaker-name {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 5px;
          color: #060c22;
          transition: all 0.3s ease;
        }
        
        .speaker-card:hover .speaker-name {
          color: #f82249;
        }
        
        .speaker-title {
          color: #f82249;
          font-style: italic;
          margin-bottom: 15px;
          font-size: 16px;
        }
        
        .speaker-bio {
          color: #6c757d;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 15px;
          transition: all 0.3s ease;
        }
        
        .speaker-card:hover .speaker-bio {
          color: #495057;
        }
        
        .speaker-social {
          display: flex;
          justify-content: center;
          gap: 15px;
        }
        
        .speaker-social a {
          color: #060c22;
          font-size: 18px;
          transition: all 0.3s ease;
          background: #f8f9fa;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .speaker-social a:hover {
          color: #f82249;
          transform: translateY(-5px);
          background: #fff;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        /* Schedule Section */
        #schedule {
          background: #fff;
        }
        
        .schedule-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .schedule-nav {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
          border-bottom: 1px solid #eee;
        }
        
        .schedule-nav button {
          background: none;
          border: none;
          padding: 10px 25px;
          font-size: 18px;
          font-weight: 600;
          color: #060c22;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .schedule-nav button:hover {
          color: #f82249;
        }
        
        .schedule-nav button.active {
          color: #f82249;
        }
        
        .schedule-nav button.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #f82249;
          animation: underlineGrow 0.3s ease-out;
        }
        
        .schedule-day {
          display: ${activeDay === 'day1' ? 'block' : 'none'};
          background: #f8f9fa;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
          animation: fadeIn 0.5s ease-out;
        }
        
        .schedule-day.day2 {
          display: ${activeDay === 'day2' ? 'block' : 'none'};
          animation: fadeIn 0.5s ease-out;
        }
        
        .schedule-day.day3 {
          display: ${activeDay === 'day3' ? 'block' : 'none'};
          animation: fadeIn 0.5s ease-out;
        }
        
        .schedule-day h3 {
          color: #f82249;
          font-size: 24px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
        
        .schedule-day h3 i {
          margin-right: 10px;
        }
        
        .schedule-item {
          display: flex;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px dashed #ddd;
          transition: all 0.3s ease;
        }
        
        .schedule-item:hover {
          transform: translateX(10px);
        }
        
        .schedule-time {
          flex: 0 0 120px;
          color: #f82249;
          font-weight: 600;
        }
        
        .schedule-details {
          flex: 1;
        }
        
        .schedule-details h4 {
          font-size: 18px;
          margin-bottom: 5px;
          color: #060c22;
        }
        
        .schedule-details p {
          color: #6c757d;
          font-size: 14px;
        }
        
        .schedule-details .speaker-name {
          color: #f82249;
          font-size: 14px;
          font-weight: 500;
          margin-top: 5px;
        }
        
        /* Venue Section */
        #venue {
          background: #f8f9fa;
        }
        
        .venue-content {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          gap: 30px;
        }
        
        .venue-text {
          flex: 1;
          min-width: 300px;
        }
        
        .venue-tabs {
          display: flex;
          margin-bottom: 30px;
          border-bottom: 1px solid #ddd;
        }
        
        .venue-tab {
          padding: 10px 20px;
          cursor: pointer;
          font-weight: 600;
          color: #060c22;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .venue-tab:hover {
          color: #f82249;
        }
        
        .venue-tab.active {
          color: #f82249;
        }
        
        .venue-tab.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 3px;
          background: #f82249;
          animation: underlineGrow 0.3s ease-out;
        }
        
        .venue-description p {
          color: #6c757d;
          margin-bottom: 15px;
          line-height: 1.6;
        }
        
        .venue-map-container {
          flex: 1;
          min-width: 300px;
          height: 400px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          position: relative;
          transition: all 0.3s ease;
        }
        
        .venue-map-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.15);
        }
        
        .venue-map {
          width: 100%;
          height: 100%;
          background: #eee;
        }
        
        .venue-images {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 40px auto 0;
          padding: 0 20px;
        }
        
        .venue-image {
          height: 200px;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          position: relative;
          transition: all 0.3s ease;
        }
        
        .venue-image:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .venue-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.5s ease;
        }
        
        .venue-image:hover img {
          transform: scale(1.1);
        }
        
        /* Gallery Section */
        #gallery {
          background: #fff;
        }
        
        .gallery {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .gallery-item {
          height: 200px;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: all 0.3s ease;
        }
        
        .gallery-item:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.5s ease;
        }
        
        .gallery-item:hover img {
          transform: scale(1.1);
        }
        
        /* Contact Section */
        #contact {
          background: #060c22;
          color: #fff;
        }
        
        .contact-info {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .contact-info p {
          color: rgba(255,255,255,0.7);
          font-size: 18px;
          margin-bottom: 30px;
          line-height: 1.6;
        }
        
        .contact-details {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 30px;
          margin-bottom: 40px;
        }
        
        .contact-box {
          display: flex;
          align-items: center;
          gap: 15px;
          background: rgba(255,255,255,0.05);
          padding: 20px;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        
        .contact-box:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-5px);
        }
        
        .contact-box i {
          font-size: 24px;
          color: #f82249;
          transition: all 0.3s ease;
        }
        
        .contact-box:hover i {
          transform: scale(1.2);
        }
        
        .contact-box div h4 {
          font-size: 18px;
          margin-bottom: 5px;
          color: #fff;
        }
        
        .contact-box div p {
          color: rgba(255,255,255,0.7);
          font-size: 16px;
          margin: 0;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 20px;
        }
        
        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.05);
          border-radius: 50%;
          color: #fff;
          font-size: 18px;
          transition: all 0.3s ease;
        }
        
        .social-links a:hover {
          background: #f82249;
          color: #fff;
          transform: translateY(-5px) scale(1.1);
        }
        
        /* Footer */
        .footer {
          background: #0a0e23;
          color: #fff;
        }
        
        .footer-top {
          padding: 80px 0;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 20px;
          gap: 30px;
        }
        
        .footer-col {
          flex: 1;
          min-width: 250px;
        }
        
        .footer-col h4 {
          font-size: 18px;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
          color: #fff;
        }
        
        .footer-col h4::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 2px;
          background: #f82249;
          transition: width 0.3s ease;
        }
        
        .footer-col:hover h4::after {
          width: 80px;
        }
        
        .footer-col p {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .footer-links {
          list-style: none;
        }
        
        .footer-links li {
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }
        
        .footer-links li:hover {
          transform: translateX(5px);
        }
        
        .footer-links a {
          color: rgba(255,255,255,0.7);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.3s ease;
          display: block;
        }
        
        .footer-links a:hover {
          color: #f82249;
        }
        
        .footer-newsletter input {
          width: 100%;
          padding: 10px;
          border: none;
          background: rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 5px;
          margin-bottom: 10px;
          transition: all 0.3s ease;
        }
        
        .footer-newsletter input:focus {
          outline: none;
          background: rgba(255,255,255,0.2);
        }
        
        .footer-newsletter button {
          background: #f82249;
          color: #fff;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          width: 100%;
        }
        
        .footer-newsletter button:hover {
          background: #e61e42;
          transform: translateY(-3px);
        }
        
        .footer-bottom {
          background: #060c22;
          padding: 20px 0;
          text-align: center;
        }
        
        .footer-bottom p {
          color: rgba(255,255,255,0.7);
          font-size: 14px;
          margin: 0;
        }
        
        .footer-bottom a {
          color: #f82249;
          text-decoration: none;
          transition: all 0.3s ease;
        }
        
        .footer-bottom a:hover {
          text-decoration: underline;
        }
        
        @media (max-width: 992px) {
          .nav {
            padding: 15px 30px;
          }
          
          .nav.scrolled {
            padding: 10px 30px;
          }
          
          #home h1 {
            font-size: 48px;
          }
          
          #home p {
            font-size: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .nav {
            padding: 15px 20px;
            flex-direction: column;
            gap: 15px;
          }
          
          .nav.scrolled {
            padding: 10px 20px;
          }
          
          .nav ul {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          #home h1 {
            font-size: 36px;
          }
          
          #home p {
            font-size: 18px;
          }
          
          .section-header h2 {
            font-size: 28px;
          }
          
          .venue-content {
            flex-direction: column;
          }
          
          .venue-map-container {
            height: 300px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;