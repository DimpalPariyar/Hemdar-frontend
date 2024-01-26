function PersonalInfo() {
  return (
    <div className="">
      <div className="px-2 py-4 flex flex-col gap-4 w-full">
        <div className="flex gap-4 w-full">
          <input
            type="text"
            placeholder="First Name"
            className="focus:outline-0 border-2 p-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            className="focus:outline-0 border-2 p-2"
          />
        </div>
        <input
          type="number"
          placeholder="Mobile number"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          type="text"
          placeholder="E-mail address "
          className="focus:outline-0 border-2 p-2"
        />
      </div>
    </div>
  );
}
export default PersonalInfo;
