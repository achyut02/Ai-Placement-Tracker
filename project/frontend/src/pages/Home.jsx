import React from "react";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const projects = [
    {
      title: "AI Placement Tracker",
      description: "AI-powered tool for students to track placement preparation progress.",
      link: "https://github.com/achyut02/Ai-Placement-Tracker",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      title: "Freelancing Service Website",
      description: "A platform for finding service providers like doctors, mechanics, and more.",
      link: "https://github.com/achyut02/freelancing-service-website",
      gradient: "from-green-500 to-teal-600"
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white px-4 sm:px-8 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-screen text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-pink-400 drop-shadow-lg relative"
        >
          <span className="relative inline-block">
            Hi, I'm Achyut 🚀
            {/* Animated glow effect */}
            <motion.div
              className="absolute inset-0 bg-pink-400/20 rounded-lg blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg sm:text-xl text-gray-300 mb-8 max-w-xl px-4"
        >
          <Typewriter
            options={{
              strings: [
                "Full-Stack Developer",
                "AI Enthusiast", 
                "Electronics & Telecommunication Engineer"
              ],
              autoStart: true,
              loop: true,
              delay: 50,
              deleteSpeed: 30
            }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.a
            href="#projects"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(236, 72, 153, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 font-semibold overflow-hidden group"
          >
            <span className="relative z-10">View My Work</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </motion.a>
          
          <motion.a
            href="#contact"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold group"
          >
            <span className="relative z-10">Get In Touch</span>
          </motion.a>
        </motion.div>
      </section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="relative py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          My Projects
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.5)"
              }}
              className="group relative p-6 sm:p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700/50 hover:border-pink-500/50 transition-all duration-500 cursor-pointer"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10">
                <motion.h3 
                  className="text-xl sm:text-2xl font-semibold mb-3 text-white group-hover:text-pink-300 transition-colors duration-300"
                  whileHover={{ x: 5 }}
                >
                  {project.title}
                </motion.h3>
                
                <p className="text-gray-400 group-hover:text-gray-300 mb-6 leading-relaxed transition-colors duration-300">
                  {project.description}
                </p>
                
                <motion.a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center text-pink-400 hover:text-pink-300 font-medium transition-colors duration-300 group/link"
                >
                  <span>View on GitHub</span>
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    →
                  </motion.span>
                </motion.a>
              </div>
              
              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                initial={false}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="relative py-20 text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <motion.h2 
          variants={itemVariants}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
        >
          Get in Touch
        </motion.h2>
        
        <motion.p 
          variants={itemVariants}
          className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto px-4"
        >
          Let's collaborate or just say hello 👋
        </motion.p>
        
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.a
            href="mailto:achyut@example.com"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(236, 72, 153, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              y: [0, -5, 0],
            }}
            transition={{ 
              y: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            className="relative bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl shadow-lg transition-all duration-300 font-semibold overflow-hidden group"
          >
            <span className="relative z-10">Contact Me</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-pink-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
          </motion.a>
          
          <motion.a
            href="https://linkedin.com/in/achyut"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className="relative border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold group"
          >
            <span className="relative z-10">LinkedIn</span>
          </motion.a>
        </motion.div>
      </motion.section>
    </main>
  );
}