import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const totalPages = Math.ceil(todos.length / itemsPerPage);
  const displayedTodos = todos.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Generate pagination buttons dynamically
  const paginationRange = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end === totalPages) start = Math.max(1, end - 4);

    const pages = [];
    if (start > 1) pages.push(1);
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    if (end < totalPages) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Todo List</h1>

      {loading ? (
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedTodos.map((todo) => (
                <tr key={todo.id} className="border-b hover:bg-gray-50 transition-all">
                  <td className="py-3 px-4 text-center">{todo.id}</td>
                  <td className="py-3 px-4 text-center">{todo.userId}</td>
                  <td className="py-3 px-4">{todo.title}</td>
                  <td className={`py-3 px-4 font-semibold text-center ${todo.completed ? "text-green-600" : "text-red-600"}`}>
                    {todo.completed ? "✔ Completed" : "⏳ Pending"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 p-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-4 py-2 rounded-md ${
                page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              ◀
            </button>

            {paginationRange().map((item, index) =>
              typeof item === "number" ? (
                <button
                  key={index}
                  onClick={() => setPage(item)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    page === item ? "bg-green-600 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {item}
                </button>
              ) : (
                <span key={index} className="px-3 py-2 text-gray-500">...</span>
              )
            )}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className={`px-4 py-2 rounded-md ${
                page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
