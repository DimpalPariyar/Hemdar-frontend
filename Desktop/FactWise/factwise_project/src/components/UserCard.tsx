import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { useEffect, useState } from "react";
import moment from "moment";
import { MdOutlineCancel, MdOutlineCheckCircleOutline } from "react-icons/md";
import { useFormik } from "formik";
import DeleteDialogBox from "./DeleteDialogBox";

interface Props {
  celebrity: Celebrity;
  updateData: (data: Celebrity) => void;
  handleDelete: (id: number) => void;
}

interface Celebrity {
  id: number;
  first: string;
  last: string;
  dob: string;
  gender: string;
  email: string;
  picture: string;
  country: string;
  description: string;
}

const UserCard: React.FC<Props> = ({ celebrity, updateData, handleDelete }) => {
  //   console.log(celebrity);
  const [isOpen, setIsOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>(
    celebrity.gender
  );
  const [error, seterror] = useState<{ country?: string }>({});
  const [deleteDialogbox, setDeleteDialogbox] = useState(false);

  function handleDeleteDialogbox() {
    setDeleteDialogbox(true);
  }

  const calculateAge = (dob: string) => {
    const today = moment();
    const dobDate = moment(dob, "YYYY-MM-DD");

    const age = today.diff(dobDate, "years");

    return age;
  };

  //   const age = calculateAge(celebrity.dob);
  //   console.log(age);

  const validate = (val: Celebrity) => {
    if (/\d/.test(val.country)) {
      seterror({ country: "Country must be a text" });
    } else {
      seterror({});
    }
  };

  const { values, handleChange, handleSubmit, setValues, dirty } = useFormik({
    initialValues: {
      ...celebrity,
      age: calculateAge(celebrity.dob),
      name: `${celebrity.first} ${celebrity.last}`,
    },
    validate: validate,
    // validationSchema: basicScheme,
    onSubmit: updateData,
  });
  //   console.log(values);
  //   console.log(errors);

  const handleSelectGenderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedGender(event.target.value);
    setValues({ ...values, gender: event.target.value });
  };

  function toggleIsOpen() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    if (!isOpen) {
      setEdit(false);
    }
  }, [isOpen]);

  function handleEdit() {
    if (values.age >= 18) {
      setEdit(!edit);
    } else {
      setEdit(false);
    }
  }

  return (
    <>
      {deleteDialogbox ? (
        <DeleteDialogBox
          setDeleteDialogbox={setDeleteDialogbox}
          id={values.id}
          handleDelete={handleDelete}
        />
      ) : (
        <div className="border-2 border-gray-300 my-4 rounded-md py-2 px-6">
          <div className="flex  justify-between items-center">
            <div className="flex items-center gap-4">
              <img className="border rounded-full" src={values.picture} />
              {edit ? (
                <form>
                  <input
                    name="name"
                    onChange={handleChange}
                    value={values.name}
                    className="border font-semibold text-xl px-2 text-black rounded-xl py-1 placeholder:text-black"
                  />
                </form>
              ) : (
                <h1 className=" font-semibold text-xl">{values.name}</h1>
              )}
            </div>
            <button onClick={toggleIsOpen}>
              {isOpen ? <SlArrowUp /> : <SlArrowDown />}
            </button>
          </div>
          {isOpen && (
            <div>
              <form onSubmit={handleSubmit}>
                <div className="my-4 flex justify-between gap-4 w-full">
                  <div>
                    <h1 className="text-gray-500">Age</h1>
                    {edit ? (
                      <>
                        <input
                          name="age"
                          onChange={handleChange}
                          type="number"
                          value={values.age}
                          className="border px-2 text-black rounded-xl py-1 w-full placeholder:text-black"
                        />
                      </>
                    ) : (
                      <p>{`${values.age} Years`}</p>
                    )}
                  </div>
                  <div>
                    <h1 className=" text-gray-500">Gender</h1>
                    {edit ? (
                      <select
                        value={selectedGender}
                        onChange={handleSelectGenderChange}
                        className="border px-2 text-black rounded-xl py-1 w-full placeholder:text-black"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="trangender">Transgender</option>
                        <option value="rather not say">Rather not say</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      // <input
                      //   placeholder={values.gender}
                      //   className="border px-2 text-black rounded-xl py-1 w-full placeholder:text-black"
                      // />
                      <p>{values.gender}</p>
                    )}
                  </div>
                  <div>
                    <h1 className=" text-gray-500">Country</h1>
                    {edit ? (
                      <>
                        <input
                          name="country"
                          type="text"
                          onChange={handleChange}
                          value={values.country}
                          className="border px-2 text-black rounded-xl py-1 w-full placeholder:text-black"
                        />
                        {error?.country && (
                          <p className=" text-[10px] text-red-400 text-center">
                            {error?.country}
                          </p>
                        )}
                      </>
                    ) : (
                      <p>{values.country}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className=" text-gray-500">Description</h1>
                  {edit ? (
                    <textarea
                      className="border px-2 rounded-xl py-1 w-full h-36"
                      name="description"
                      onChange={handleChange}
                      value={values.description}
                    ></textarea>
                  ) : (
                    <p>{values.description}</p>
                  )}
                </div>
                <div className="flex justify-end gap-4 my-6 text-2xl">
                  {edit ? (
                    <button
                      type="button"
                      onClick={() => {
                        setValues({
                          ...celebrity,
                          age: calculateAge(celebrity.dob),
                          name: `${celebrity.first} ${celebrity.last}`,
                        });
                        setEdit(false);
                      }}
                    >
                      <MdOutlineCancel className=" text-red-400" />
                    </button>
                  ) : (
                    <button onClick={handleDeleteDialogbox}>
                      <RiDeleteBin6Line className=" text-red-600" />
                    </button>
                  )}

                  {edit ? (
                    <button
                      disabled={!dirty}
                      type="button"
                      onClick={() => {
                        handleSubmit;
                        setEdit(false);
                      }}
                    >
                      <MdOutlineCheckCircleOutline
                        className={`${
                          dirty ? "text-green-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ) : (
                    <button onClick={handleEdit}>
                      <GrEdit className=" text-blue-600" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default UserCard;
