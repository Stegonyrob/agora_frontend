import PostListAdmin from '../Components/Blog/admin/list/PostListAdmin';


const AdminView = () => {




   return (
      <div>
         <h1>Admin View</h1>
         <PostListAdmin userId={1} />
      </div>
   );
};

export default AdminView;