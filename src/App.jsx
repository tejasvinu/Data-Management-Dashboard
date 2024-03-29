import 'bootstrap/dist/css/bootstrap.min.css';
import UriUpload from './components/UriUpload';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MyNavbar from './components/Navbar';
import FileList from './components/FileList';
import LinkUpload from './components/LinkUpload';
import LinksList from './components/FileList';
import DbView from './components/DbView';
import DbList from './components/DbList';
import ScraperList from "./components/ScraperList.jsx";
import FileUploadComponent from "./components/file2dbUpload.jsx";
import ScraperUploadComponent from "./components/ScraperUpload.jsx";
function App() {

  return (
    <div className="App">
      <MyNavbar />
      <Router>
        <Routes>
          <Route path="/" element={<UriUpload />} />
          <Route path="/files" element={<FileList />} />
          <Route path="/links" element={<LinkUpload />} />
          <Route path="/linksList" element={<DbList />} />
          <Route path="/tableData/:id" element={<DbView />} />
            <Route path="/scrapers" element={<ScraperList />} />
            <Route path="/file2db" element={<FileUploadComponent />} />
            <Route path="/scraperUpload" element={<ScraperUploadComponent />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
