export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-y-4">
      <h1>Home Page</h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => (window.location.href = "/call")}
      >
        Call to Backoffice
      </button>
    </div>
  );
}
