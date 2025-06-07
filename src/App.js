import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Download, Mail, Phone, MapPin, ExternalLink, Award, Play, Pause } from 'lucide-react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { useSpring, animated, config } from 'react-spring';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faYoutube, faVimeo } from '@fortawesome/free-brands-svg-icons';
import { useTypewriter, Cursor } from 'react-simple-typewriter';
import { useInView } from 'react-intersection-observer';
import YouTube from 'react-youtube';

// Remove the SVG import since we'll use it from public directory
// import { ReactComponent as MeSvg } from '../public/me.svg';

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeSection, setActiveSection] = useState('hero');
  const [isPlaying, setIsPlaying] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionsRef = useRef({});
  const parallaxRef = useRef();

  // Typewriter effect for subtitle
  const [text] = useTypewriter({
    words: ['3D Animator', 'Visual Storyteller', 'Creative Artist'],
    loop: true,
    delaySpeed: 2000,
  });

  // Mouse tracking for interactive background
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    Object.values(sectionsRef.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    sectionsRef.current[sectionId]?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants for Framer Motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Letter animation for name
  const letterVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  // 1. Add a ref for the new three.js background container at the top of the component
  const threeBgRef = useRef(null);

  // 2. Add a useEffect for a more vibrant three.js background (neon, glow, smooth movement)
  useEffect(() => {
    if (!threeBgRef.current) return;
    let renderer, scene, camera, animationId;
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    threeBgRef.current.appendChild(renderer.domElement);

    // Neon glowing spheres and torus knots
    const neonColors = [0x00fff7, 0xff00ea, 0x00ff85, 0x7b2ff2, 0xf357a8];
    const objects = [];
    for (let i = 0; i < 10; i++) {
      const geometry = i % 2 === 0 ? new THREE.SphereGeometry(Math.random() * 2 + 1, 32, 32)
        : new THREE.TorusKnotGeometry(Math.random() * 1.2 + 0.8, 0.3, 100, 16);
      const material = new THREE.MeshPhysicalMaterial({
        color: neonColors[i % neonColors.length],
        emissive: neonColors[i % neonColors.length],
        emissiveIntensity: 1.2,
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 0.7,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 60
      );
      mesh.userData = {
        speed: Math.random() * 0.008 + 0.004,
        rotSpeed: Math.random() * 0.01 + 0.005,
        axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
      };
      scene.add(mesh);
      objects.push(mesh);
    }
    // Neon point lights
    for (let i = 0; i < 3; i++) {
      const light = new THREE.PointLight(neonColors[i], 2, 200);
      light.position.set((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, 40 + i * 20);
      scene.add(light);
    }
    camera.position.z = 40;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      objects.forEach((obj, idx) => {
        obj.rotation.x += obj.userData.rotSpeed;
        obj.rotation.y += obj.userData.rotSpeed;
        obj.position.x += Math.sin(Date.now() * obj.userData.speed * 0.5 + idx) * 0.01;
        obj.position.y += Math.cos(Date.now() * obj.userData.speed * 0.5 + idx) * 0.01;
      });
      renderer.render(scene, camera);
    };
    animate();
    // Responsive
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      if (threeBgRef.current && renderer.domElement) {
        threeBgRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update the SVG component to use img tag with container
  const MeSvgComponent = () => (
    <div className="relative rounded-[15px] overflow-hidden bg-gradient-to-r from-fuchsia-500/20 to-blue-500/20 p-1 backdrop-blur-sm border border-fuchsia-400/30 shadow-lg hover:shadow-fuchsia-400/30 transition-all duration-300">
      <img 
        src="/me.svg"
        alt="Manya Jain"
        className="w-full h-full rounded-[15px]"
        style={{
          filter: 'drop-shadow(0 0 15px rgba(255, 0, 234, 0.4))',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );

  // Helper for section animation
  const useSectionSpring = (sectionId) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
    const spring = useSpring({
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0px)' : 'translateY(60px)',
      config: config.molasses,
    });
    return [ref, spring];
  };

  // About Section
  const [aboutRef, aboutSpring] = useSectionSpring('about');
  // Services Section
  const [servicesRef, servicesSpring] = useSectionSpring('services');
  // Skills Section
  const [skillsRef, skillsSpring] = useSectionSpring('skills');
  // Projects Section
  const [projectsRef, projectsSpring] = useSectionSpring('projects');
  // Achievements Section
  const [achievementsRef, achievementsSpring] = useSectionSpring('achievements');
  // Contact Section
  const [contactRef, contactSpring] = useSectionSpring('contact');

  // Add state to hold gallery images
  const [galleryImages, setGalleryImages] = useState([]);
  useEffect(() => {
    // List of images from photoshop and sketches (hardcoded for now, can be automated)
    setGalleryImages([
      // Photoshop
      '/visual_art_gallery/photoshop/pamphlet1.png',
      '/visual_art_gallery/photoshop/pamphlet2.png',
      '/visual_art_gallery/photoshop/movie poster.jpg',
      '/visual_art_gallery/photoshop/graphics  neon.png',
      '/visual_art_gallery/photoshop/manipulation.jpg',
      '/visual_art_gallery/photoshop/Digital_Painting_fbxDadar_Manya_Jain.png',
      '/visual_art_gallery/photoshop/digital painting2.png',
      '/visual_art_gallery/photoshop/dgpainting.png',
      '/visual_art_gallery/photoshop/batman.jpg',
      '/visual_art_gallery/photoshop/3d2.jpg',
      '/visual_art_gallery/photoshop/3d-final.jpg',
      '/visual_art_gallery/photoshop/3.png',
      '/visual_art_gallery/photoshop/10.png',
      // Sketches
      '/visual_art_gallery/sketches/IMG_6223.png',
      '/visual_art_gallery/sketches/IMG_6225.png',
      '/visual_art_gallery/sketches/IMG_6226.png',
      '/visual_art_gallery/sketches/IMG_6228.png',
      '/visual_art_gallery/sketches/IMG_9775.png',
      '/visual_art_gallery/sketches/IMG_9776.png',
      '/visual_art_gallery/sketches/IMG_9777.png',
      '/visual_art_gallery/sketches/IMG_9778.png',
      '/visual_art_gallery/sketches/IMG_9779.png',
      '/visual_art_gallery/sketches/IMG_9782(1).png',
      '/visual_art_gallery/sketches/IMG_9783.png',
    ]);
  }, []);

  const [form, setForm] = useState({ name: '', email: '', message: '' });

  return (
    <div className="bg-black min-h-screen text-white overflow-x-hidden relative font-['Roboto']">
      {/* 3D Neon Animated Background */}
      <div ref={threeBgRef} className="fixed inset-0 z-0 pointer-events-none" style={{ filter: 'blur(0.5px) brightness(1.1)' }} />
      {/* Overlay for extra vibrancy */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-fuchsia-900/40 to-black opacity-80" />
      {/* Interactive Background with aqua theme */}
      <div className="fixed inset-0 z-0">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-blue-900/30 to-black"></div>
        
        {/* Mouse-following light effect */}
        <div 
          className="absolute w-96 h-96 opacity-20 transition-all duration-300 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: 'radial-gradient(circle, rgba(0, 191, 255, 0.4) 0%, rgba(0, 191, 255, 0.2) 30%, rgba(0, 191, 255, 0.1) 60%, transparent 100%)'
          }}
        ></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                delay: i * 0.8
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 10}%`,
              }}
            ></motion.div>
          ))}
        </div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 grid-rows-12 h-full w-full">
            {[...Array(144)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-blue-400/20 hover:bg-blue-400/5"
                whileHover={{ backgroundColor: 'rgba(0, 191, 255, 0.1)' }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-lg border-b border-fuchsia-400/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex justify-between items-center">
            <motion.div 
              className="text-2xl font-bold font-['Roboto'] text-fuchsia-400 drop-shadow-lg"
              whileHover={{ scale: 1.1, color: '#ff00ea' }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              MJ
            </motion.div>
            <div className="hidden md:flex space-x-10">
              {['hero', 'about', 'services', 'skills', 'projects', 'achievements', 'contact'].map((section) => (
                <motion.button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize font-semibold text-lg transition-colors duration-300 hover:text-fuchsia-400 px-2 py-1 rounded-lg ${activeSection === section ? 'text-fuchsia-400 bg-fuchsia-400/10' : 'text-white/80'}`}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  {section === 'hero' ? 'Home' : section}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        ref={el => sectionsRef.current.hero = el}
        className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 md:px-16 py-24"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-fuchsia-900/30 to-black/90" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 md:px-12 py-10 rounded-3xl shadow-2xl bg-black/30 backdrop-blur-xl border border-fuchsia-400/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div 
              className="relative mx-auto mb-12 rounded-[20px] overflow-hidden bg-gradient-to-r from-fuchsia-500/20 to-blue-500/20 p-1 backdrop-blur-sm border border-fuchsia-400/30 shadow-lg hover:shadow-fuchsia-400/30 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: 'fit-content',
                maxWidth: '90vw',
                aspectRatio: '16/9'
              }}
            >
              <img 
                src="/MANYA.gif" 
                alt="MANYA Animation" 
                className="w-full h-full object-contain mix-blend-screen rounded-[18px]" 
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(255, 0, 234, 0.5)) brightness(1.2) contrast(1.1)',
                  opacity: 0.90
                }}
              />
            </motion.div>
            <div className="text-2xl md:text-3xl font-light mb-10 text-fuchsia-300 h-12">
              3D Animator | Visual Storyteller | Creative Artist
            </div>
            <motion.p 
              className="text-lg md:text-xl text-white/80 mb-14 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              Bringing dynamic stories to life through innovative animation techniques and creative visual narratives
            </motion.p>
            {/* YouTube Embed instead of GIF */}
            <motion.div 
              className="relative w-full max-w-3xl mx-auto mb-14 bg-fuchsia-900/30 rounded-2xl overflow-hidden backdrop-blur-sm border border-fuchsia-400/30 shadow-xl"
              whileHover={{ boxShadow: '0 0 40px #ff00ea55' }}
              transition={{ duration: 0.3 }}
            >
              <div className="aspect-video flex items-center justify-center relative">
                <YouTube videoId="vMenI7pQ2-8" className="w-full h-full rounded-2xl" opts={{ width: '100%', height: '420' }} />
              </div>
            </motion.div>
            <motion.button
              onClick={() => scrollToSection('about')}
              className="bg-gradient-to-r from-fuchsia-500 to-blue-500 hover:from-fuchsia-600 hover:to-blue-600 text-white px-10 py-5 rounded-full font-semibold transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 text-lg backdrop-blur-md border border-white/20"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255, 0, 234, 0.5)' }}
              whileTap={{ scale: 0.98 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>Explore My Work</span>
              <ChevronDown size={22} className="animate-bounce" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <animated.section
        id="about"
        ref={el => { sectionsRef.current.about = el; aboutRef(el); }}
        style={aboutSpring}
        className="py-24 px-8 md:px-20 bg-fuchsia-900/20 backdrop-blur-xl border-t border-fuchsia-400/10 rounded-3xl my-12 shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold font-['Roboto'] mb-14 text-center bg-gradient-to-r from-fuchsia-400 to-white bg-clip-text text-transparent drop-shadow-xl"
              whileHover={{ scale: 1.05, textShadow: '0 0 12px #ff00ea88' }}
            >
              About Me
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div 
                className="space-y-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.p variants={fadeInUp} className="text-lg text-white/90 leading-relaxed">
                  I'm an aspiring 3D animator with a strong foundation in creativity, problem-solving, and multitasking. 
                  Known for my patience and attention to detail, I'm passionate about bringing dynamic stories to life 
                  through innovative animation techniques.
                </motion.p>
                <motion.p variants={fadeInUp} className="text-lg text-white/90 leading-relaxed">
                An under-graduate in Mass Media Communications with a specialization in Animation who loves bringing stories to life through movement and emotion.
                My journey so far has included collaborative projects, creative challenges,
                and moments of recognition that continue to shape me as an artist.
                </motion.p>
                <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                  <motion.div 
                    className="bg-blue-400/20 px-4 py-2 rounded-full border border-blue-400/30"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 191, 255, 0.3)' }}
                  >
                    <span className="text-blue-400 font-semibold">Creative</span>
                  </motion.div>
                  <motion.div 
                    className="bg-blue-400/20 px-4 py-2 rounded-full border border-blue-400/30"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 191, 255, 0.3)' }}
                  >
                    <span className="text-blue-400 font-semibold">Detail-Oriented</span>
                  </motion.div>
                  <motion.div 
                    className="bg-blue-400/20 px-4 py-2 rounded-full border border-blue-400/30"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 191, 255, 0.3)' }}
                  >
                    <span className="text-blue-400 font-semibold">Team Player</span>
                  </motion.div>
                </motion.div>
              </motion.div>
              <motion.div 
                className="relative flex items-center justify-center"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="w-96 h-96 relative">
                  <MeSvgComponent />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </animated.section>

      {/* Services Section */}
      <animated.section
        id="services"
        ref={el => { sectionsRef.current.services = el; servicesRef(el); }}
        style={servicesSpring}
        className="py-24 px-8 md:px-20 bg-fuchsia-900/20 backdrop-blur-xl border-t border-fuchsia-400/10 rounded-3xl my-12 shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold font-['Roboto'] mb-14 text-center bg-gradient-to-r from-fuchsia-400 to-white bg-clip-text text-transparent drop-shadow-xl"
              whileHover={{ scale: 1.05, textShadow: '0 0 12px #ff00ea88' }}
            >
              What I Do
            </motion.h2>
            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                { icon: '🎭', title: '3D Animation', desc: 'Character rigging and animation with fluid motion and storytelling' },
                { icon: '🎨', title: '3D Modeling', desc: 'Detailed 3D models and environments for various applications' },
                { icon: '📱', title: 'Digital Art', desc: 'Digital paintings, concept art, and visual development' },
                { icon: '🏆', title: 'Creative Direction', desc: 'Team leadership and project management for creative productions' },
                { icon: '🖼️', title: 'Graphic Design', desc: 'I create visually appealing designs for branding, posters, digital art, and more. My work combines creativity with clear communication to bring ideas to life.' }
              ].map((service, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  className="bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20"
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)'
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div 
                    className="text-4xl mb-4"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >{service.icon}</motion.div>
                  <motion.h3 className="text-xl font-bold font-['Roboto'] mb-3 text-blue-300">{service.title}</motion.h3>
                  <motion.p className="text-white/80">{service.desc}</motion.p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </animated.section>

      {/* Skills Section - Removed percentage bars */}
      <animated.section
        id="skills"
        ref={el => { sectionsRef.current.skills = el; skillsRef(el); }}
        style={skillsSpring}
        className="py-24 px-8 md:px-20 bg-fuchsia-900/20 backdrop-blur-xl border-t border-fuchsia-400/10 rounded-3xl my-12 shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold font-['Roboto'] mb-14 text-center bg-gradient-to-r from-fuchsia-400 to-white bg-clip-text text-transparent drop-shadow-xl"
              whileHover={{ scale: 1.05, textShadow: '0 0 12px #ff00ea88' }}
            >
              Skills & Software
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-6 text-blue-300"
                  whileHover={{ textShadow: '0 0 8px rgba(0, 191, 255, 0.5)' }}
                >Software Expertise</motion.h3>
                <motion.div 
                  className="grid grid-cols-2 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    'AutoDesk Maya',
                    'AutoDesk 3Ds Max',
                    'Adobe Photoshop',
                    'Adobe Premiere Pro',
                    'Adobe After Effects',
                    'Katana'
                  ].map((software, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      custom={index}
                      className="bg-blue-400/20 px-4 py-3 rounded-lg text-center"
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: 'rgba(0, 191, 255, 0.3)',
                        boxShadow: '0 0 15px rgba(0, 191, 255, 0.3)'
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span className="font-semibold">{software}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.h3 
                  className="text-2xl font-bold mb-6 text-blue-300"
                  whileHover={{ textShadow: '0 0 8px rgba(0, 191, 255, 0.5)' }}
                >Core Skills</motion.h3>
                <motion.div 
                  className="grid grid-cols-2 gap-4"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    '3D Modeling',
                    '3D Animation',
                    'Graphic Design',
                    'Digital Painting',
                    'Character Design'
                  ].map((skill, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      custom={index}
                      className="bg-blue-400/20 px-4 py-3 rounded-lg text-center"
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: 'rgba(0, 191, 255, 0.3)',
                        boxShadow: '0 0 15px rgba(0, 191, 255, 0.3)'
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span className="font-semibold">{skill}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </animated.section>

      {/* Projects Section */}
      <animated.section
        id="projects"
        ref={el => { sectionsRef.current.projects = el; projectsRef(el); }}
        style={projectsSpring}
        className="py-24 px-8 md:px-20 bg-fuchsia-900/20 backdrop-blur-xl border-t border-fuchsia-400/10 rounded-3xl my-12 shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold font-['Roboto'] mb-14 text-center bg-gradient-to-r from-fuchsia-400 to-white bg-clip-text text-transparent drop-shadow-xl"
              whileHover={{ scale: 1.05, textShadow: '0 0 12px #ff00ea88' }}
            >
              Featured Projects
            </motion.h2>
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  title: '"Sprouts" - CGI Film',
                  desc: 'Led a team of 10 to create a 2-minute CGI film within 2.5 months',
                  role: 'Team Lead',
                  image: <img src="/images/Sprouts/IMG_1752.gif" alt="Sprouts GIF" className="w-full h-48 object-cover rounded-xl" />,
                  extra: <>
                    <img src="/images/Sprouts/animatics.gif" alt="Sprouts Animatics" className="w-full h-32 object-cover rounded-xl my-2" />
                    <img src="/images/Sprouts/Short_film_storyboard (1).gif" alt="Storyboard GIF" className="w-full h-32 object-cover rounded-xl my-2" />
                    <a href="/images/Sprouts/Short_film_storyboard (1).pdf" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Storyboard PDF</a>
                  </>
                },
                {
                  title: 'Rockstar Competition',
                  desc: 'National Runner-Up for character rigging and animation',
                  role: 'Animator',
                  image: <img src="/images/Rockstar/Dadar_Manya_Rigging&Animation_Animation_File.gif" alt="Rockstar Animation" className="w-full h-48 object-cover rounded-xl" />,
                  extra: <img src="/images/Rockstar/Dadar_Manya_Animation&Rigging_Rigging_Test.gif" alt="Rockstar Rigging Test" className="w-full h-32 object-cover rounded-xl my-2" />
                },
                {
                  title: 'Stop Motion Animation',
                  desc: 'First Prize in ILLENIUM Animation Competition',
                  role: 'Animator',
                  image: <img src="/images/Stopmotion/IMG_4007.gif" alt="Stop Motion" className="w-full h-48 object-cover rounded-xl" />
                },
                {
                  title: 'GAFX Animation',
                  desc: 'National-level recognition for excellence in animation',
                  role: 'Animator',
                  image: <img src="/images/GAFX_Animation/dialogue ref.gif" alt="GAFX Animation" className="w-full h-48 object-cover rounded-xl" />
                },
                {
                  title: 'Brand Campaign',
                  desc: 'Complete brand creation including logo, ads, and packaging',
                  role: 'Creative Director',
                  image: '📦',
                  extra: <a href="/images/advertesment/Pencils.pdf" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline">View Campaign PDF</a>
                },
                {
                  title: 'Visual Art Gallery',
                  desc: 'Collection of digital paintings and concept art',
                  role: 'Digital Artist',
                  image: '🎨'
                }
              ].map((project, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  className="bg-black/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-blue-400/20"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: '0 0 20px rgba(0, 191, 255, 0.3)'
                  }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div className="h-48 bg-gradient-to-br from-blue-400/30 to-black/50 flex items-center justify-center text-6xl">
                    {project.image}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-['Roboto'] mb-2 text-blue-300">{project.title}</h3>
                    <p className="text-white/80 mb-3">{project.desc}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-200 bg-blue-400/20 px-3 py-1 rounded-full">
                        {project.role}
                      </span>
                      <ExternalLink size={16} className="text-white/60 hover:text-blue-300 cursor-pointer" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </animated.section>

      {/* Visual Art Gallery Section */}
      <animated.section
        id="visual-art-gallery"
        className="py-24 px-8 md:px-20 bg-black border-t border-cyan-400/10 rounded-3xl my-12 shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-5xl font-bold font-['Roboto'] mb-14 text-center bg-gradient-to-r from-cyan-400 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-xl"
            whileHover={{ scale: 1.05, textShadow: '0 0 12px #00fff7' }}
          >
            Visual Art Gallery
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {galleryImages.map((src, idx) => {
              // Check if the image is an SVG
              const isSvg = src.toLowerCase().endsWith('.svg');
              
              return (
                <motion.div
                  key={src}
                  className="rounded-xl overflow-hidden bg-transparent hover:bg-black/20 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.04 }}
                  style={{ 
                    minHeight: '220px', 
                    maxHeight: '340px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(0, 255, 247, 0.1)'
                  }}
                >
                  {isSvg ? (
                    <object
                      data={src}
                      type="image/svg+xml"
                      className="w-full h-full object-contain max-h-80 transition-transform duration-300 hover:scale-105"
                      style={{ 
                        filter: 'drop-shadow(0 0 10px rgba(0, 255, 247, 0.2))',
                        mixBlendMode: 'screen'
                      }}
                    >
                      <img src={src} alt={`Art ${idx + 1}`} className="w-full h-full object-contain" />
                    </object>
                  ) : (
                    <img 
                      src={src} 
                      alt={`Art ${idx + 1}`} 
                      className="w-full h-full object-contain max-h-80 transition-transform duration-300 hover:scale-105" 
                      style={{ 
                        filter: 'drop-shadow(0 0 10px rgba(0, 255, 247, 0.2))'
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </animated.section>

      {/* Achievements Section */}
      <animated.section
        id="achievements"
        ref={el => { sectionsRef.current.achievements = el; achievementsRef(el); }}
        style={achievementsSpring}
        className="py-24 px-8 md:px-20 bg-fuchsia-900/20 backdrop-blur-xl border-t border-fuchsia-400/10 rounded-3xl my-12 shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold font-['Roboto'] mb-14 text-center bg-gradient-to-r from-fuchsia-400 to-white bg-clip-text text-transparent drop-shadow-xl"
              whileHover={{ scale: 1.05, textShadow: '0 0 12px #ff00ea88' }}
            >
              Achievements
            </motion.h2>
            <motion.div 
              className="space-y-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  year: '2025',
                  title: 'Runner-Up - Student Category',
                  organization: 'GAFX (Game, Animation & Visual Effects Conference)',
                  location: 'Bangalore',
                  desc: 'National-level recognition for excellence in animation'
                },
                {
                  year: '2023',
                  title: 'National Runner-Up',
                  organization: 'Rockstar Animation & Rigging Competition',
                  location: 'Frameboxx',
                  desc: 'Character rigging and animation showcase'
                },
                {
                  year: '2023',
                  title: 'First Prize',
                  organization: 'ILLENIUM Stop Motion Animation Competition',
                  location: 'Atlas Skill-Tech University',
                  desc: 'Animation based on "Ancient Japan" theme'
                }
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  custom={index}
                  className="flex items-start space-x-6 bg-black/30 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/20"
                  whileHover={{ 
                    boxShadow: '0 0 20px rgba(0, 191, 255, 0.2)',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                  }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="flex-shrink-0">
                    <motion.div 
                      className="w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <Award size={24} className="text-black" />
                    </motion.div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-blue-300 font-bold text-lg">{achievement.year}</span>
                      <div className="h-1 bg-blue-400/50 flex-grow"></div>
                    </div>
                    <h3 className="text-xl font-bold font-['Roboto'] mb-1 text-white">{achievement.title}</h3>
                    <p className="text-blue-300 font-semibold mb-1">{achievement.organization}</p>
                    <p className="text-white/60 text-sm mb-2">{achievement.location}</p>
                    <p className="text-white/80">{achievement.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </animated.section>

      {/* Contact Section */}
      <animated.section
        id="contact"
        ref={el => { sectionsRef.current.contact = el; contactRef(el); }}
        style={contactSpring}
        className="py-24 px-8 md:px-20 bg-fuchsia-900/20 backdrop-blur-xl border-t border-fuchsia-400/10 rounded-3xl my-12 shadow-xl"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl font-bold font-['Roboto'] mb-14 text-center bg-gradient-to-r from-fuchsia-400 to-white bg-clip-text text-transparent drop-shadow-xl"
              whileHover={{ scale: 1.05, textShadow: '0 0 12px #ff00ea88' }}
            >
              Let's Create Together
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-12">
              <motion.div 
                className="space-y-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <motion.div variants={fadeInUp}>
                  <h3 className="text-2xl font-bold mb-6 text-blue-400">Contact Information</h3>
                  <div className="space-y-4">
                    <motion.div 
                      className="flex items-center space-x-4"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 191, 255, 0.3)' }}
                      >
                        <Mail size={20} className="text-blue-400" />
                      </motion.div>
                      <div>
                        <p className="text-white/60 text-sm">Email</p>
                        <p className="text-white font-semibold">manyaj.work@gmail.com</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-4"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 191, 255, 0.3)' }}
                      >
                        <Phone size={20} className="text-blue-400" />
                      </motion.div>
                      <div>
                        <p className="text-white/60 text-sm">Phone</p>
                        <p className="text-white font-semibold">+91 8779782063</p>
                      </div>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-4"
                      whileHover={{ x: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <motion.div 
                        className="w-12 h-12 bg-blue-400/20 rounded-full flex items-center justify-center border border-blue-400/30"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 191, 255, 0.3)' }}
                      >
                        <MapPin size={20} className="text-blue-400" />
                      </motion.div>
                      <div>
                        <p className="text-white/60 text-sm">Location</p>
                        <p className="text-white font-semibold">Mumbai, India</p>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp}>
                  <motion.a
                    href="/Manya Jain Resume.pdf"
                    download
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 inline-flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 247, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Download size={20} className="animate-pulse" />
                    <span>Download Resume</span>
                  </motion.a>
                </motion.div>
              </motion.div>

              <motion.div 
                className="bg-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-400/20"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ boxShadow: '0 0 30px rgba(0, 191, 255, 0.2)' }}
              >
                <h3 className="text-2xl font-bold mb-6 text-blue-400">Send Message</h3>
                <div className="space-y-6">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-black/30 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-black/30 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors duration-300"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <textarea
                      rows={5}
                      placeholder="Your Message"
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-black/30 border border-blue-400/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-blue-400 focus:outline-none transition-colors duration-300 resize-none"
                    ></textarea>
                  </motion.div>
                  <motion.button
                    onClick={() => {
                      window.location.href = `mailto:manyaj.work@gmail.com?subject=Contact from ${form.name} (${form.email})&body=${encodeURIComponent(form.message)}`;
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 backdrop-blur-md border border-white/20"
                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 191, 255, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Send Message
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </animated.section>

      {/* Footer with updated theme */}
      <footer className="py-12 px-6 bg-blue-900/20 backdrop-blur-sm border-t border-blue-400/20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <motion.p 
            className="text-white/60"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            © {new Date().getFullYear()} Manya Jain. All rights reserved.
          </motion.p>
          <div className="flex space-x-6">
<a href="https://www.linkedin.com/in/manya-jain-ba31b4286/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-fuchsia-400 text-3xl"><FontAwesomeIcon icon={faLinkedin} /></a>
            <a href="https://www.youtube.com/@manyajain6008" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-fuchsia-400 text-3xl"><FontAwesomeIcon icon={faYoutube} /></a>
            <a href="https://vimeo.com/manyajain" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-fuchsia-400 text-3xl"><FontAwesomeIcon icon={faVimeo} /></a>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

export default Portfolio;