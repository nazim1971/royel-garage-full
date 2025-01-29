import { Button } from "antd";
import PasswordChangeModel from "../../components/modal/PasswordChangeModel";
import { useGetUserByEmailQuery,useUpdateUserMutation } from "../../redux/features/admin/user.Api"
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";
import { useState } from "react";


const Profile = () => {
  const user = useAppSelector(selectCurrentUser);
  const {data: Suser} = useGetUserByEmailQuery(user?.email);
 

  
  // const [updateUser] = useUpdateUserMutation();

  const [openModal, setOpenModal] = useState(false);  // Modal state
  
  const handlePasswordChange = () => {
    setOpenModal(true);  // Open the password change modal
  };
  

  return (
    <>
    <div>
      <h2>Profile</h2>
      <h3>Name: {Suser?.data?.name}</h3>
      <h3>Email: {Suser?.data?.email}</h3>
    </div>

    <Button onClick={handlePasswordChange}>
      Change Password
    </Button>

    {Suser?.data && (
      <PasswordChangeModel
        user={Suser?.data}  // Pass user data to the modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    )}
  </>
  )
}

export default Profile