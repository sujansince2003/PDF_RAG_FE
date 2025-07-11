import Chat from "./components/Chat";
import FileUpload from "./components/FileUpload";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {" "}
      {/* Responsive layout */}
      <div className="lg:w-[30%] min-h-[30vh] lg:min-h-screen flex p-4 justify-center items-center border-b-2 lg:border-r-2 lg:border-b-0">
        <FileUpload />
      </div>
      <div className="lg:w-[70%] min-h-[70vh] lg:min-h-screen border-l-0 lg:border-l-2 border-t-2 lg:border-t-0 relative">
        {" "}
        {/* Relative for fixed chat input */}
        <Chat />
      </div>
    </div>
  );
}
