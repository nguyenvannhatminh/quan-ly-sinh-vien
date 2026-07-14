import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from "react";
function App() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setCount((count) => count + 1);
    }, 1000);
  });
  const [data, setData] = useState();
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      // Thực hiện yêu cầu GET bằng Fetch API
      const response = await fetch('https://fuzzy-disco-x5rqw7q6x5w9c6gj6-5000.app.github.dev/data');
      // Kiểm tra xem phản hồi có thành công không (mã trạng thái 200-299)
      if (!response.ok) {
        throw new Error('Phản hồi mạng không hợp lệ');
      }
      // Phân tích dữ liệu JSON từ phản hồi
      const result = await response.json();
      // Cập nhật trạng thái với dữ liệu đã lấy
      setData(result);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error.message);
    }
  };
  // Render component
  if (!data) return <div>Loading...{count} seconds </div>; // Rendered first
  //return <div>{data.name}</div>; // Rendered after fetch
  return (
    <div className="App">
      <div className="table-title">Fetch Data Example : </div>
      <div className ='table-header'>
        <div>Name</div>
        <div>ID</div>
        <div>Status</div>
      </div>
      <div className ='table-row'>
        <div>{data.name}</div>
        <div>{data.id}</div>
        <div>{data.active ? 'Active' : 'Inactive'}</div>
      </div>
    </div>
  );
}
export default App;
