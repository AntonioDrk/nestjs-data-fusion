import axios from "axios";
import { useQuery } from "react-query";

const POSTS_URL = "http://localhost:3300/posts";

const fetchPosts = async (): Promise<any> => {
  const response = await axios.get(POSTS_URL, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    }
  });
  return response.data;
}

const Posts = function (props: { isLoggedIn: boolean }) {
  const { isLoggedIn } = props;

  if (!isLoggedIn) {
    return <div className="text-3xl">Please log in first</div>;
  }

  const { isLoading, isError, error, data } = useQuery<any, Error>("posts", fetchPosts, {
    cacheTime: 5 * 60 * 1000,
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading posts...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  console.log(data);

  return (<>
    <div className="text-3xl">
      Posts made by you
    </div>
    <div className="flex flex-row px-16 pt-8">
      {
        data.map((postData: any) => {
          return (
            <div key={postData.id} className="border border-red-200 flex flex-col">
              <div className="text-xl self-start font-bold">Title: <span className="pl-2">{postData.title}</span></div>
              <div className="text-md">{postData.body}</div>
            </div>
          )
        })
      }
    </div >
  </>
  )
}

export default Posts;