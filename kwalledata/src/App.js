import logo from './logo.svg';
import './App.css';
import { Doughnut } from 'react-chartjs-2';
import { useState, useCallback } from 'react';
import LandingPage from './landingpage';
import ChartJs from './chartjs';

const App = () => {
  const [data, setData] = useState([]);
  const [headerData, setHeaderData] = useState({});
  const [selectValue, setSelectValue] = useState("Date");
  const upload = () => {
    const files = document.getElementById('file_upload').files;
    if (files.length == 0) {
      alert("Please choose any file...");
      return;
    }
    const filename = files[0].name;
    const extension = filename.substring(filename.lastIndexOf(".")).toUpperCase();
    if (extension == '.CSV') {
      //Here calling another method to read CSV file into json
      csvFileToJSON(files[0]);
    } else {
      alert("Please select a valid csv file.");
    }
  }

  const setColHeaders = (rowData) => {
    if (rowData) {
      const cols = rowData.split(',')
      const headerData = cols.reduce((acc, colName) => {
        acc[colName] = '';
        return acc;
      }, {})
      setHeaderData(headerData)
    }
  }

  const delay = ms => new Promise(res => setTimeout(res, ms))

  const getRowData = useCallback((row) => {
    const data = {};
    Object.keys(headerData).forEach((key, i) => {
      data[key] = row[i] || "";
    }, {})
    return {...data};
  }, [headerData])

  const setFormRowsData = useCallback((rows) => {
    const rowsData = rows.reduce((acc, row) => {
      if (row) {
        const colsData = row.split(',')
        const newData = getRowData(colsData);
        if (newData) {
          acc.push(newData)
          return acc;
        }
      }
    }, [])
    if (rowsData.length === rows.length) {
      setData(rowsData);
    }

  }, [headerData])

  const csvFileToJSON = (file) => {
    try {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = function (e) {
        const jsonData = [];
        const headers = [];
        const rows = e.target.result.split("\r\n");
        const colHeads = rows.splice(0, 1)[0] || "";
        setColHeaders(colHeads)
        setFormRowsData(rows)      
      }
    } catch (e) {
      console.error(e);
    }
  }
  const onChange = (event) => {
    const value = event.target.value;
    setSelectValue(value);
  };
 
  return (
    <div className="App">
      <div>
        <h1>KwalleData</h1>
      </div>
      <div id="display_csv_data">
        <input type="file"
          //onChange={this.onFileChange}
          id="file_upload"
        />
        <button
          onClick={upload}
        >
          Upload!
        </button>
      </div>
      <div style={{width : "800px",margin:"auto auto"}}>      
        {data.length > 0 &&
          <ChartJs data={data} onselect={data} />
        }
      </div>

    </div>
  );
}
export default App;
