const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
	const listMostLikes = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
			likes: 5,
			__v: 0
		},
        {
			_id: '5a422aa71b54a676234d17f9',
			title: 'Canonical string reduction',
			author: 'Edsger W. Dijkstra',
			url: 'https://homepages.cwi.nl/~storm/',
			likes: 12,
			__v: 0
		},
		{
			_id: '5a422aa71b54a676234d17f6',
			title: 'Other blog',
			author: "Robert C. Martin",
			likes: 17
		}	
	]

const counts = {};
let maxLikes = 0;
let authorWithMostLikes = null;

listMostLikes.forEach(blog => {
	counts[blog.author] = (counts[blog.author] || 0) + + blog.likes;
	if (counts[blog.author] > maxLikes) {
		maxLikes = counts[blog.author];
		authorWithMostLikes = blog.author;
	}
});

test('author with the most likes', () => {
	const result = listHelper.mostLikes(listMostLikes)
	const expected = {
		author: authorWithMostLikes,
		likes: maxLikes
	};
	assert.deepStrictEqual(result, expected)
	console.log(expected)
})
})