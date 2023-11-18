import { Formik } from "formik";
import CreatePostPage from "./creatpostpage";

const MainCreatPost = () => {
  const initialValues = {
    title: "",
    description: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={(values) => {
        // console.log("Submitted:", values);
      }}
    >
      {({ values, handleSubmit, handleChange }) => (
        <CreatePostPage
          values={values}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
        />
      )}
    </Formik>
  );
};

export default MainCreatPost;
