import FileUpload from "./components/FileUpload";
export default function Home() {
  return (
    <div>
      <div className="min-h-screen  w-screen flex">
        <div className="w-[30%] min-h-screen flex p-4 justify-center items-center">
          <FileUpload />
        </div>
        <div className="w-[70%] border-l-2 ">2</div>
      </div>
    </div>
  );
}
