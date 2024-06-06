const dummy = (blogs) => 1

const totalLikes = (listWithOneBlog) => listWithOneBlog[0].likes

const favoriteBlog = (listBlogs) => Math.max(...listBlogs.map(blog => blog.likes));

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
