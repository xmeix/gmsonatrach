import "./Filter.css";
const Filter = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const data = [
        { name: 'Alice', age: 20 },
        { name: 'Bob', age: 25 },
        { name: 'Charlie', age: 30 },
      ];
    
      const filteredData = data.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return ( 
        <div className="filter">
        <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
        />
        </div>
     );
}
 
export default Filter;