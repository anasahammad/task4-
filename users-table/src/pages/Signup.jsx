import axios from "axios";
import { useContext } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../Provider/AuthProvider";
import { Link, useNavigate } from "react-router-dom";


const Signup = () => {
    const {setUser} = useContext(AuthContext)

    const navigate = useNavigate()
    const handleSubmit = async (event)=>{
        event.preventDefault()
        const form = event.target;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;


        const userInfo = {name, email, password}

        console.log(userInfo)
        try {
            const { data } = await axios.post(
              `${import.meta.env.VITE_BASE_URL}/signup`,
              userInfo
            );
            navigate("/")
            console.log(data);
            if (data.user) {
              Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Account Created Successful",
                showConfirmButton: false,
                timer: 1500,
              });
      
              localStorage.setItem('token', data.token)
              setUser({name: data.user.name, email: data.user.email, password: data.user.password})
              form.reset()
              navigate("/")
            }
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: `User Already Exist`,
              footer: '<a href="#">Why do I have this issue?</a>',
            });
            console.log(error.message);
          }
    }
    return (
        <div className="flex items-center justify-center text-center  bg-black text-white h-screen">

	<form onSubmit={handleSubmit} noValidate="" action="" className="flex flex-col w-full max-w-lg p-12 rounded shadow-lg ">
		<label htmlFor="name" className="self-start text-xs font-semibold"> Name</label>
		<input name="name" id="name" type="text" className="flex items-center h-12 px-4 mt-2 rounded  focus:outline-none focus:ring-2  focus:text-black" />
		<label htmlFor="email" className="self-start text-xs font-semibold"> Email</label>
		<input name="email" id="email" type="email" className="flex items-center h-12 px-4 mt-2 rounded  focus:outline-none focus:ring-2  focus:text-black" />
		<label htmlFor="password" className="self-start mt-3 text-xs font-semibold">Password</label>
		<input name="password" id="password" type="password" className="flex items-center h-12 px-4 mt-2 rounded  focus:outline-none focus:ring-2  focus:text-black" />
		<button type="submit" className="flex items-center justify-center h-12 px-6 mt-8 text-sm font-semibold rounded  bg-purple-800 text-white">Sign Up</button>
		<div className="flex justify-center mt-6 space-x-2 text-xs ">
			<a rel="noopener noreferrer" href="#" className="">Forgot Password?</a>
			<span className="">/</span>
			<Link to="/login" rel="noopener noreferrer" href="#" className="">Login</Link>
		</div>
	</form>
</div>
    );
};

export default Signup;