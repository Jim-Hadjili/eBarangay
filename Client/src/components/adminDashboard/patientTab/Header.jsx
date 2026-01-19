export default function Header() {
  return (
    <>
      {" "}
      <div className="flex flex-col gap-4 mb-6 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl font-Lexend">
            Patients Management
          </h2>
          <p className="text-sm text-gray-600 sm:text-base font-Lexend">
            View and manage patient records
          </p>
        </div>
      </div>
    </>
  );
}
