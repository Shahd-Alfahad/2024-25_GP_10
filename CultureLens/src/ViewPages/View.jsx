import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { realtimeDb, db, auth } from '../Register/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Header } from "../Header/Header";
import { Footer } from "../Footer/Footer";
import Search from "@mui/icons-material/Search";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

import './View.css';

export function RealtimeData() {
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [filterRegion, setFilterRegion] = useState(''); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userRegion, setUserRegion] = useState(''); 
  const [filterTopic, setFilterTopic] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user's region from Firestore
    const fetchUserRegion = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'Users', user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserRegion(userData.region || '');
            } else {
              console.log('No user region data found.');
            }
          } catch (error) {
            console.error('Error fetching user region:', error);
          }
        }
      });
    };

    fetchUserRegion();

    // Fetch table data from Firebase Realtime Database
    const dbRef = ref(realtimeDb, '/');
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const dataArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setTableData(dataArray);
        } else {
          setError('No data available in Firebase.');
        }
      },
      (error) => {
        setError('Error fetching data: ' + error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleRegionChange = (e) => setFilterRegion(e.target.value);

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    const matchedRow = tableData.find((row) => 
      (row.en_question && row.en_question.toLowerCase().includes(searchValue.toLowerCase())) ||
      (row.topic && row.topic.toLowerCase().includes(searchValue.toLowerCase()))
    );

    if (matchedRow) {
      setFilterTopic(matchedRow.topic);
    } else {
      setFilterTopic('');
    }
  };

  const handleTopicChange = (e) => {
    const selectedTopic = e.target.value;
    setSearchTerm('');
    setFilterTopic(selectedTopic === "Holiday" ? "Holidays/Celebration/Leisure" : selectedTopic);
  };

  const handleRowsPerPageChange = (e) => {
    let value = parseInt(e.target.value, 10);
    if (value > 1500) value = 1500;
    setRowsPerPage(value);
  };

  const handleEditClick = (row) => {
    if (row.region_name === userRegion) {
      navigate(`/edit/${row.id}`, {
        state: {
          attribute: row.en_question,
          topic: row.topic,
        },
      });
    }
  };

  const filteredData = tableData.filter((row) => {
    const matchesRegion = !filterRegion || (row.region_name && row.region_name.toLowerCase().includes(filterRegion.toLowerCase()));

    const matchesSearch = 
      (row.region_name && row.region_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.en_question && row.en_question.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.topic && row.topic.toLowerCase().includes(searchTerm.toLowerCase())) ||
      row.annotations?.some((annotation) => 
        annotation.en_values && annotation.en_values[0] && annotation.en_values[0].toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesTopic = !filterTopic || (row.topic && row.topic.toLowerCase().includes(filterTopic.toLowerCase()));

    return matchesRegion && matchesSearch && matchesTopic;
  });

  const dataToShow = filteredData.slice(0, Math.min(filteredData.length, rowsPerPage));
  const displayedFilterTopic = filterTopic === "Holidays/Celebration/Leisure" ? "Holiday" : filterTopic;

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='viewpage'>
      <Header />
      <div className="container mt-5">
        <div class='notification-btn-container'>
          <button class='notification-btn'>Notify moderator {<NotificationsActiveIcon />}</button>
        </div>

        <section class='tabel_header'>
          <h2 className='table-title'>Cultures Data</h2>
        </section>

        <div className="filter-Search-inputs-container">
          <div className="search-container">
            <span className="search-icon">
              <Search style={{ color: '#888', fontSize: '20px' }} />
            </span>
            <input
              type="text"
              className="search-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="filter-container">
            <select className="filter-select" value={filterRegion} onChange={handleRegionChange}>
              <option value="">All Regions</option>
              <option value="Western">Western</option>
              <option value="Chinese">Chinese</option>
              <option value="Arab">Arab</option>
            </select>
            <select className="filter-select" value={displayedFilterTopic} onChange={handleTopicChange}>
              <option value="">All Topics</option>
              <option value="Food">Food</option>
              <option value="Education">Education</option>
              <option value="Work life">Work life</option>
              <option value="Sport">Sport</option>
              <option value="Holiday">Holiday</option>
              <option value="Family">Family</option>
              <option value="Greeting">Greeting</option>
            </select>
            <label style={{ marginLeft: '15px' }}>Show</label>
            <input
              type="number"
              value={rowsPerPage}
              min="1"
              max="1500"
              onChange={handleRowsPerPageChange}
              style={{ width: '60px', marginLeft: '5px', marginRight: '5px' }}
            />
            <label>entries</label>
          </div>
        </div>

        <div class='table_container'>
          <table className="data-table">
            <thead>
              <tr class="tabel_titles">
                <th></th>
                <th>Region</th>
                <th>Attribute</th>
                <th>Values</th>
                <th>Topic</th>
                <th>Reason</th>
                <th>Edit</th> 
              </tr>
            </thead>
            <tbody>
              {dataToShow.map((row, index) => (
                <tr key={row.id}>
                  <td>{index + 1}</td>
                  <td>{row.region_name}</td>
                  <td>{row.en_question}</td>
                  <td>
                    <select className="value-select">
                      {row.annotations?.map((annotation, i) => (
                        <option key={i} value={annotation.en_values[0]}>
                          {annotation.en_values[0]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className={`topic-column ${row.topic === "Holidays/Celebration/Leisure" ? "left-align" : "center-align"}`}>
                    {row.topic}
                  </td>
                  <td>Variation</td>
                  <td>
                    <button
                      onClick={() => handleEditClick(row)}
                      className="edit-button"
                      style={{
                        backgroundColor: row.region_name === userRegion ? '#10a37f' : '#d3d3d3',
                        cursor: row.region_name === userRegion ? 'pointer' : 'not-allowed',
                      }}
                      disabled={row.region_name !== userRegion}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RealtimeData;
