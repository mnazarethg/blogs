const dummy = (blogs) => 1

const totalLikes = (listWithOneBlog) => listWithOneBlog[0].likes

const favoriteBlog = (listBlogs) => {
  const maxLikes = Math.max(...listBlogs.map(blog => blog.likes));
  const favorite = listBlogs.find(blog => blog.likes === maxLikes);
  return favorite;
}

const mostBlogs = (listMostBlogs)  => {
  const counts = {};
  let maxBlogs = 0;
  let authorWithMostBlogs = null;

  listMostBlogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1;
    if (counts[blog.author] > maxBlogs) {
      maxBlogs = counts[blog.author];
      authorWithMostBlogs = blog.author;
    }
  });

  return {
    author: authorWithMostBlogs,
    blogs: maxBlogs
  };
}

const mostLikes = (listMostLikes)  => {
  const counts = {};
  let maxLikes = 0;
  let authorWithMostLikes = null;

  listMostLikes.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
    if (counts[blog.author] > maxLikes) {
      maxLikes = counts[blog.author];
      authorWithMostLikes = blog.author;
    }
  });

  return {
    author: authorWithMostLikes,
    likes: maxLikes
  };
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog, 
  mostBlogs, 
  mostLikes
}
