import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Navbar, PostCard, Sidebar } from "../../components";
import { getPosts } from "../../features/postsSlice";
import styles from "./feed.module.css";

export const Feed = () => {
  const { postsLoading, posts } = useAppSelector((store) => store?.posts);
  const auth = useAppSelector((store) => store.auth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  console.log(posts);

  const filteredPosts = posts.filter(
    (post) =>
      post.uid === auth.id ||
      auth.userDetails?.following.some((user) => user === post.uid)
  );

  return (
    <div>
      <Navbar />
      <div className="container">
        <Sidebar />
        <main className="main-container">
          {postsLoading ? (
            <h2>Loading...</h2>
          ) : (
            filteredPosts?.map((post) => {
              return <PostCard key={post.postID} {...post} />;
            })
          )}
        </main>
      </div>
    </div>
  );
};
