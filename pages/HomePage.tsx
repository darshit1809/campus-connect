import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Book, Megaphone, ArrowRight } from 'lucide-react';
import { announcementsAPI, eventsAPI, resourcesAPI } from '../lib/api';
import { formatRelativeTime, truncateText } from '../lib/utils';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Avatar from '../components/common/Avatar';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Comment {
  _id: string;
  content: string;
  createdAt: string;
  createdBy: User;
}

interface Announcement {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: User;
  comments: Comment[];
}

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  createdBy: User;
  registeredUsers: string[];
}

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  uploadedBy: User;
}

const HomePage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [announcementsRes, eventsRes, resourcesRes] = await Promise.all([
          announcementsAPI.getAll(),
          eventsAPI.getAll(),
          resourcesAPI.getAll()
        ]);
        
        setAnnouncements(announcementsRes.data.slice(0, 3));
        setEvents(eventsRes.data.slice(0, 3));
        setResources(resourcesRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader size="lg" />
      </div>
    );
  }
  
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
        <div className="relative py-20 px-6 sm:px-12 md:py-28 md:px-16 text-white">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 font-display tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                Campus Connect
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-2xl font-light leading-relaxed">
              Your one-stop platform for campus announcements, events, and resources. Stay connected with what's happening on campus.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/announcements">
                <Button className="bg-white text-purple-600 hover:bg-purple-50 font-medium px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-lg">
                  View Announcements
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 font-medium px-8 py-4 rounded-lg transition-all duration-300 text-lg">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Latest Announcements */}
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Megaphone className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 ml-3 font-display">Latest Announcements</h2>
          </div>
          <Link to="/announcements" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium group">
            View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {announcements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {announcements.map(announcement => (
              <Card key={announcement._id} className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-purple-200">
                <Card.Header className="flex items-start space-x-4 p-6">
                  <Avatar name={announcement.createdBy?.name || 'User'} size="sm" />
                  <div>
                    <Card.Title className="text-lg font-semibold text-gray-900">{truncateText(announcement.title, 40)}</Card.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Posted by {announcement.createdBy?.name} • {formatRelativeTime(announcement.createdAt)}
                    </p>
                  </div>
                </Card.Header>
                <Card.Content className="flex-grow px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {truncateText(announcement.description, 100)}
                  </p>
                </Card.Content>
                <Card.Footer className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="text-sm text-gray-500">
                    {announcement.comments.length} comments
                  </div>
                  <Link to={`/announcements/${announcement._id}`}>
                    <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800">
                      Read More
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No announcements available.</p>
          </div>
        )}
      </section>
      
      {/* Upcoming Events */}
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 ml-3 font-display">Upcoming Events</h2>
          </div>
          <Link to="/events" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium group">
            View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map(event => (
              <Card key={event._id} className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-purple-200">
                <Card.Header className="bg-purple-50 p-6">
                  <div className="flex justify-between items-start">
                    <Card.Title className="text-lg font-semibold text-gray-900">{truncateText(event.title, 40)}</Card.Title>
                    <div className="bg-purple-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <Card.Description className="text-purple-700 mt-2">
                    Organized by {event.createdBy?.name}
                  </Card.Description>
                </Card.Header>
                <Card.Content className="flex-grow p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {truncateText(event.description, 80)}
                  </p>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-purple-600 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                      {event.location}
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="text-sm text-gray-500">
                    {event.registeredUsers?.length || 0} registered
                  </div>
                  <Link to={`/events/${event._id}`}>
                    <Button variant="primary" size="sm" className="bg-purple-600 hover:bg-purple-700">
                      View Details
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No upcoming events.</p>
          </div>
        )}
      </section>
      
      {/* Recent Resources */}
      <section className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Book className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 ml-3 font-display">Recent Resources</h2>
          </div>
          <Link to="/resources" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium group">
            View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map(resource => (
              <Card key={resource._id} className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-purple-200">
                <Card.Header className="p-6">
                  <Card.Title className="text-lg font-semibold text-gray-900">{truncateText(resource.title, 40)}</Card.Title>
                  <div className="flex items-center mt-3 space-x-3">
                    <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                      {resource.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(resource.createdAt)}
                    </span>
                  </div>
                </Card.Header>
                <Card.Content className="flex-grow px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {truncateText(resource.description, 80)}
                  </p>
                </Card.Content>
                <Card.Footer className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="text-sm text-gray-500 flex items-center">
                    <Avatar name={resource.uploadedBy?.name || 'User'} size="xs" />
                    <span className="ml-2">{resource.uploadedBy?.name}</span>
                  </div>
                  <Link to={`/resources/${resource._id}`}>
                    <Button variant="outline" size="sm" className="text-purple-600 border-purple-200 hover:bg-purple-50">
                      View Resource
                    </Button>
                  </Link>
                </Card.Footer>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-500">No resources available.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;