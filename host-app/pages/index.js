import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      <Header/>
      <Body/>
      <Footer/>
    </div>
  );
}

function Header() {
  return (
    <header className="flex justify-between items-center bg-white p-4 text-black fixed top-0 left-0 w-full z-50">
      <div className="text-lg font-bold">
        hOST - Imagehoster
      </div>
      <Image
        className="light"
        src="/ost_logo.png"
        alt="OST logo"
        width={100}
        height={100}
        priority
      />
    </header>
  );
}
export function Body() {
  return (
    <div className="flex flex-col items-center justify-center py-2 h-screen w-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md mt-4 mb-4 mx-2">
        <h2 className="text-2xl text-black font-bold text-center">Upload your images</h2>
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to uploa.</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" />
          </label>
        </div> 
      </div>


      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md mt-4 mb-4 mx-2">
        <h2 className="text-2xl font-bold text-center text-black">Enter your password</h2>
        <div className="flex items-center justify-center w-full">
          <input
            type="password"
            className="text-black w-full h-12 border-2 border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100"
            placeholder="Password"
          />
        </div>
      </div>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Hochladen
      </button>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="flex justify-center items-center p-4 bg-white text-black fixed bottom-0 left-0 w-full">
      <p>&copy; 2024 CLDE Project</p>
    </footer>
  );
}