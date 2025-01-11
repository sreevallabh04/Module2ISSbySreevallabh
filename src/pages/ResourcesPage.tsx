import React from "react";

const ResourcesPage = () => {
  const resources = [
    { title: "22MIS1013 - MOHAMMAD ZAID HUSAIN", link: "https://drive.google.com" },
    { title: "22MIS1089 - AATHIRA A", link: "https://drive.google.com" },
    { title: "22MIS1095 - ALKA C S", link: "https://drive.google.com" },
    { title: "22MIS1110 - AMAN", link: "https://drive.google.com" },
    { title: "22MIS1142 - KRISHNA YADAV", link: "https://drive.google.com" },
    { title: "22MIS1147 - JOSHIKA B R", link: "https://drive.google.com" },
    { title: "22MIS1150 - DIVYANSHU SINGH", link: "https://drive.google.com" },
    { title: "22MIS1159 - JANAKI HARI KUMAR", link: "https://drive.google.com" },
    { title: "22MIS1167 - KAMEPALLI VENKATA RAMA KRISHNA", link: "https://drive.google.com" },
    { title: "22MIS1170 - SREEVALLABH", link: "https://drive.google.com" },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-black to-gray-900 text-white relative overflow-hidden">
      {/* Floating Space Icons */}
      <div className="absolute top-10 left-10 w-16 h-16 animate-bounce">
        <img src="https://img.icons8.com/color/96/rocket.png" alt="Rocket" />
      </div>
      <div className="absolute bottom-20 right-16 w-20 h-20 animate-spin-slow">
        <img src="https://img.icons8.com/color/96/planet.png" alt="Planet" />
      </div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 animate-pulse">
        <img src="https://img.icons8.com/color/96/star.png" alt="Star" />
      </div>

      {/* Page Content */}
      <h1 className="text-4xl font-bold text-center mb-8">Space-Themed Resources</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {resources.map((resource, index) => (
          <div
            key={index}
            className="bg-gray-800 bg-opacity-90 shadow-lg rounded-lg p-6 flex flex-col items-center text-center"
          >
            <h2 className="text-xl font-semibold mb-4">{resource.title}</h2>
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              View Resource
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourcesPage;
