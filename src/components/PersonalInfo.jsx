function PersonalInfo({ values, handleChange }) {
  return (
    <div className="">
      <div className="px-2 py-4 flex flex-col gap-4 w-full">
        <input
          value={values.username}
          onChange={handleChange}
          id="username"
          type="text"
          placeholder="User Name"
          className="focus:outline-0 border-2 p-2"
        />

        <input
          value={values.mobile}
          onChange={handleChange}
          id="mobile"
          type="number"
          placeholder="Mobile number"
          className="focus:outline-0 border-2 p-2"
        />
        <input
          value={values.email}
          onChange={handleChange}
          id="email"
          type="text"
          placeholder="E-mail address "
          className="focus:outline-0 border-2 p-2"
        />
      </div>
    </div>
  );
}
export default PersonalInfo;
