import { useGetUserByEmailQuery } from "../../redux/features/admin/user.Api"
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";


const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
  const {data: Suser} = useGetUserByEmailQuery(user?.email)

  console.log(Suser);

  return (
    <div>
      <h2>Prodile</h2>
      <h3>Name: {Suser?.data?.name} </h3>
      <h3>Email: {Suser?.data?.email} </h3>
    </div>
  )
}

export default Profile