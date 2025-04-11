import React, { useState } from 'react';
import { 
  BookOpen, 
  Video, 
  Globe, 
  FileText, 
  Code, 
  Brain, 
  Search, 
  MessageSquare,
  RefreshCw,
  Calculator,
  Shield,
  Lock,
  Key,
  Server
} from 'lucide-react';
import { getConceptExplanation } from '../services/ai';

type ResourceCategory = 'all' | 'books' | 'tutorials' | 'tools' | 'articles' | 'courses';
type ResourceTopic = 'all' | 'classical' | 'modern' | 'mathematics' | 'applications';

interface Resource {
  title: string;
  description: string;
  link: string;
  type: ResourceCategory;
  topics: ResourceTopic[];
  icon: React.ElementType;
  featured?: boolean;
}

const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ResourceCategory>('all');
  const [topicFilter, setTopicFilter] = useState<ResourceTopic>('all');
  const [recommendationPrompt, setRecommendationPrompt] = useState('');
  const [aiRecommendations, setAIRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Resource list
  const resources: Resource[] = [
    {
      title: "Introduction to Modern Cryptography",
      description: "A comprehensive textbook covering principles and practices of modern cryptography.",
      link: "https://www.cs.umd.edu/~jkatz/imc.html",
      type: "books",
      topics: ["modern", "mathematics"],
      icon: BookOpen,
      featured: true
    },
    {
      title: "Cryptography: An Introduction",
      description: "Nigel Smart's introductory textbook on cryptography, available as a free PDF.",
      link: "https://www.cs.umd.edu/~waa/414-F11/IntroToCrypto.pdf",
      type: "books",
      topics: ["classical", "modern", "mathematics"],
      icon: BookOpen
    },
    {
      title: "Khan Academy Cryptography Course",
      description: "Free introductory course on cryptography and encryption methods.",
      link: "https://www.khanacademy.org/computing/computer-science/cryptography",
      type: "courses",
      topics: ["classical", "modern", "mathematics"],
      icon: Video,
      featured: true
    },
    {
      title: "Cryptography I by Stanford University (Coursera)",
      description: "Comprehensive course taught by Dan Boneh covering cryptographic concepts.",
      link: "https://www.coursera.org/learn/crypto",
      type: "courses",
      topics: ["modern", "applications", "mathematics"],
      icon: Video
    },
    {
      title: "CyberChef - The Cyber Swiss Army Knife",
      description: "Web-based encryption, encoding, compression and data analysis tool.",
      link: "https://gchq.github.io/CyberChef/",
      type: "tools",
      topics: ["classical", "modern", "applications"],
      icon: Code,
      featured: true
    },
    {
      title: "Cryptool - Educational Cryptography Tool",
      description: "Interactive tool for learning about encryption algorithms and methods.",
      link: "https://www.cryptool.org/en/",
      type: "tools",
      topics: ["classical", "modern"],
      icon: Calculator
    },
    {
      title: "DCode - Cipher Identifier and Solver",
      description: "Online tool that helps identify and solve various cipher types.",
      link: "https://www.dcode.fr/en",
      type: "tools",
      topics: ["classical", "applications"],
      icon: Lock
    },
    {
      title: "Practical Cryptography for Developers",
      description: "Free online book covering practical cryptography concepts with code examples.",
      link: "https://cryptobook.nakov.com/",
      type: "books",
      topics: ["modern", "applications"],
      icon: BookOpen
    },
    {
      title: "Handbook of Applied Cryptography",
      description: "Comprehensive reference text available as a free PDF with mathematical foundations.",
      link: "http://cacr.uwaterloo.ca/hac/",
      type: "books",
      topics: ["modern", "mathematics"],
      icon: BookOpen
    },
    {
      title: "Computerphile's Cryptography Videos",
      description: "Collection of informative videos explaining cryptography concepts.",
      link: "https://www.youtube.com/playlist?list=PLzH6n4zXuckpoaxDKOOV26yhgoY2S-xYg",
      type: "tutorials",
      topics: ["classical", "modern", "applications"],
      icon: Video
    },
    {
      title: "Crypto 101",
      description: "Introductory course in cryptography, free and open.",
      link: "https://www.crypto101.io/",
      type: "tutorials",
      topics: ["classical", "modern"],
      icon: BookOpen
    },
    {
      title: "Cryptography Stack Exchange",
      description: "Q&A community for cryptography professionals and enthusiasts.",
      link: "https://crypto.stackexchange.com/",
      type: "articles",
      topics: ["classical", "modern", "mathematics", "applications"],
      icon: MessageSquare
    },
    {
      title: "Cryptopals Crypto Challenges",
      description: "Practical cryptography challenges to learn by doing.",
      link: "https://cryptopals.com/",
      type: "tools",
      topics: ["applications", "modern"],
      icon: Code
    },
    {
      title: "NIST Cryptography Standards",
      description: "Official U.S. government cryptography standards and guidelines.",
      link: "https://csrc.nist.gov/Projects/Cryptographic-Standards-and-Guidelines",
      type: "articles",
      topics: ["modern", "applications"],
      icon: Shield
    },
    {
      title: "The Code Book by Simon Singh",
      description: "Popular science book tracing the history of cryptography.",
      link: "https://simonsingh.net/books/the-code-book/",
      type: "books",
      topics: ["classical", "modern"],
      icon: BookOpen
    },
    {
      title: "MIT OpenCourseWare: Cryptography and Cryptanalysis",
      description: "Free course materials from MIT's cryptography course.",
      link: "https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-875-cryptography-and-cryptanalysis-spring-2005/",
      type: "courses",
      topics: ["modern", "mathematics"],
      icon: Video
    },
    {
      title: "RSA Algorithm Visualizer",
      description: "Interactive tool to visualize and understand how RSA encryption works.",
      link: "https://www.cs.drexel.edu/~jpopyack/IntroCS/HW/RSAWorksheet.html",
      type: "tools",
      topics: ["modern", "mathematics"],
      icon: Calculator
    },
    {
      title: "Cryptography Engineering by Ferguson, Schneier, and Kohno",
      description: "Practical book on designing and implementing cryptographic systems.",
      link: "https://www.schneier.com/books/cryptography-engineering/",
      type: "books",
      topics: ["modern", "applications"],
      icon: BookOpen
    },
    {
      title: "Crypto++: Free C++ Class Library of Cryptographic Schemes",
      description: "Open-source C++ library of cryptographic algorithms for developers.",
      link: "https://www.cryptopp.com/",
      type: "tools",
      topics: ["modern", "applications"],
      icon: Code
    },
    {
      title: "SSL/TLS and PKI History",
      description: "A comprehensive history of the SSL/TLS protocol and PKI.",
      link: "https://www.feistyduck.com/ssl-tls-and-pki-history/",
      type: "articles",
      topics: ["modern", "applications"],
      icon: Globe
    },
    {
      title: "Blockchain Fundamentals",
      description: "Learn about the cryptographic foundations of blockchain technology.",
      link: "https://developer.ibm.com/technologies/blockchain/tutorials/",
      type: "tutorials",
      topics: ["modern", "applications"],
      icon: Server
    },
    {
      title: "A Graduate Course in Applied Cryptography",
      description: "Advanced textbook by Dan Boneh and Victor Shoup, available as a free PDF.",
      link: "https://toc.cryptobook.us/",
      type: "books",
      topics: ["modern", "mathematics"],
      icon: BookOpen
    },
    {
      title: "Journal of Cryptology",
      description: "Academic journal publishing research papers on cryptography.",
      link: "https://www.springer.com/journal/145",
      type: "articles",
      topics: ["modern", "mathematics", "applications"],
      icon: FileText
    }
  ];

  // Get category icon
  const getCategoryIcon = (category: ResourceCategory) => {
    switch(category) {
      case 'books': return <BookOpen className="w-5 h-5" />;
      case 'tutorials': return <Video className="w-5 h-5" />;
      case 'tools': return <Code className="w-5 h-5" />;
      case 'articles': return <FileText className="w-5 h-5" />;
      case 'courses': return <Video className="w-5 h-5" />;
      default: return <Globe className="w-5 h-5" />;
    }
  };

  // Get topic display text
  const getTopicText = (topic: ResourceTopic) => {
    switch(topic) {
      case 'classical': return 'Classical Ciphers';
      case 'modern': return 'Modern Cryptography';
      case 'mathematics': return 'Mathematical Foundations';
      case 'applications': return 'Practical Applications';
      default: return 'All Topics';
    }
  };
  
  // Filter resources based on search and filters
  const filteredResources = resources.filter(resource => {
    // Apply search filter
    const matchesSearch = 
      searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply category filter
    const matchesCategory = 
      categoryFilter === 'all' || 
      resource.type === categoryFilter;
    
    // Apply topic filter
    const matchesTopic = 
      topicFilter === 'all' || 
      resource.topics.includes(topicFilter);
    
    return matchesSearch && matchesCategory && matchesTopic;
  });

  // Get AI recommendations
  const getRecommendations = async () => {
    if (!recommendationPrompt.trim()) return;
    
    try {
      setLoading(true);
      const prompt = `I'm interested in learning about ${recommendationPrompt} in cryptography. Can you recommend some resources and learning paths?`;
      const response = await getConceptExplanation(prompt);
      setAIRecommendations(response);
    } catch (error) {
      console.error('Error getting AI recommendations:', error);
      setAIRecommendations('Sorry, I encountered an error while processing your request. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get featured resources
  const featuredResources = resources.filter(resource => resource.featured);
  
  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-purple-400 mb-2">Cryptography Resources</h1>
        <p className="text-gray-300 mb-8 max-w-3xl">
          Explore our curated collection of cryptography resources, including books, tutorials, 
          tools, articles, and courses. Use filters or ask our AI for personalized recommendations.
        </p>

        {/* AI Recommendation Section */}
        <div className="mb-10 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl">
          <h2 className="text-xl font-bold text-blue-300 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            AI Resource Recommendations
          </h2>
          <div className="mb-4">
            <p className="text-gray-300 mb-2">
              Tell us what cryptography topics you're interested in learning, and our AI will suggest resources.
            </p>
            <div className="flex space-x-2">
              <input
                type="text"
                value={recommendationPrompt}
                onChange={(e) => setRecommendationPrompt(e.target.value)}
                placeholder="e.g., Public key cryptography for beginners"
                className="flex-1 px-4 py-2 bg-black/50 border border-blue-500/30 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') getRecommendations();
                }}
              />
              <button
                onClick={getRecommendations}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Brain className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          {/* AI Recommendations Output */}
          {aiRecommendations && (
            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
              <h3 className="text-lg font-medium text-blue-300 mb-2">Recommendations</h3>
              <div className="text-sm text-gray-300 prose prose-sm prose-invert max-w-none">
                {aiRecommendations.split('\n').map((para, idx) => (
                  <p key={idx} className={para.trim() === '' ? 'mt-4' : ''}>
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources..."
              className="block w-full pl-10 pr-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as ResourceCategory)}
              className="px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="books">Books</option>
              <option value="tutorials">Tutorials</option>
              <option value="tools">Tools</option>
              <option value="articles">Articles</option>
              <option value="courses">Courses</option>
            </select>
            
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value as ResourceTopic)}
              className="px-3 py-2 bg-gray-900/50 border border-purple-500/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Topics</option>
              <option value="classical">Classical Ciphers</option>
              <option value="modern">Modern Encryption</option>
              <option value="mathematics">Mathematics</option>
              <option value="applications">Applications</option>
            </select>
          </div>
        </div>

        {/* Featured Resources Section */}
        {searchQuery === '' && categoryFilter === 'all' && topicFilter === 'all' && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-purple-300 mb-4">Featured Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredResources.map((resource, index) => (
                <a 
                  key={index}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-500/30 rounded-xl p-6 hover:bg-purple-900/40 transition-colors"
                >
                  <div className="flex items-center mb-3">
                    <resource.icon className="w-6 h-6 text-purple-400 mr-2" />
                    <span className="text-xs font-medium px-2 py-1 bg-purple-900/50 rounded-full text-purple-300">
                      {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.topics.map(topic => (
                      <span 
                        key={topic} 
                        className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-300"
                      >
                        {getTopicText(topic)}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* All Resources Section */}
        <div>
          <h2 className="text-xl font-bold text-purple-300 mb-4">
            {searchQuery || categoryFilter !== 'all' || topicFilter !== 'all' 
              ? `Search Results (${filteredResources.length})`
              : 'All Resources'}
          </h2>
          
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30 hover:bg-purple-900/20 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <resource.icon className="w-5 h-5 text-purple-400 mr-2" />
                      <span className="text-xs font-medium px-2 py-1 bg-purple-900/50 rounded-full text-purple-300">
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </div>
                    <div className="text-gray-400">
                      <Globe className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{resource.title}</h3>
                  <p className="text-gray-300 text-sm mb-4">{resource.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {resource.topics.map(topic => (
                      <span 
                        key={topic} 
                        className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-300"
                      >
                        {getTopicText(topic)}
                      </span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-8 border border-purple-500/30 text-center">
              <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-300">No resources found</h3>
              <p className="text-gray-400 mt-2">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
        
        {/* Additional Learning Resources Section */}
        <div className="mt-16">
          <h2 className="text-xl font-bold text-purple-300 mb-6">Additional Learning Paths</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Lock className="w-5 h-5 text-purple-400 mr-2" />
                For Beginners
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Start with the basics of cryptography, including history, classical ciphers, and fundamental concepts.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Khan Academy Cryptography Course</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>The Code Book by Simon Singh</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Crypto 101 introductory course</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Our Classical Ciphers interactive tutorials</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Shield className="w-5 h-5 text-purple-400 mr-2" />
                For Intermediate Learners
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Deepen your understanding with modern encryption algorithms, protocols, and mathematical foundations.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Introduction to Modern Cryptography textbook</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Cryptography I by Stanford University</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Practical Cryptography for Developers</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Our DES and Modern Encryption tutorials</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md rounded-xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center">
                <Key className="w-5 h-5 text-purple-400 mr-2" />
                For Advanced Students
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Explore cutting-edge topics, research papers, and practical implementations for specialists.
              </p>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>A Graduate Course in Applied Cryptography</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Journal of Cryptology research papers</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Cryptopals Crypto Challenges</span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">•</div>
                  <span>Handbook of Applied Cryptography</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;