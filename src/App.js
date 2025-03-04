import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  const [isPending, setIsPending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
        setIsPending(false);
      });
  }, []);

  const totalPages = Math.ceil(todos.length / itemsPerPage);

  // Get the todos for the current page
  const indexOfLastTodo = currentPage * itemsPerPage;
  const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
  const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

  // Generate page numbers (show only a few at a time)
  const getPageNumbers = () => {
    const maxPageNumbers = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxPageNumbers - 1);

    if (totalPages > maxPageNumbers && end === totalPages) {
      start = end - maxPageNumbers + 1;
    }

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

      {isPending ? (
        <p className="text-xl font-semibold text-gray-600">Loading...</p>
      ) : (
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
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
              {currentTodos.map((todo) => (
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
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md ${
                currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              ◀
            </button>

            {getPageNumbers().map((page, index) =>
              typeof page === "number" ? (
                <button
                  key={index}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === page ? "bg-green-600 text-white font-bold" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={index} className="px-3 py-2 text-gray-500">...</span>
              )
            )}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md ${
                currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
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
